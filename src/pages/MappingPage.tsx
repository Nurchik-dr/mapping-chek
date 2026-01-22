// src/pages/MappingPage.tsx
import { useEffect, useMemo, useState } from "react";
import { getOverrides, saveOverride } from "../utils/overrides";
import type { RowWithStatus, MappingRow, StatusType } from "../types";
import DetailsModal from "../components/DetailsModal";
import DetailsModalInfo from "../components/DetailsModalInfo";
import Filters from "../components/Filters/Filters";
import Pagination from "../components/Pagination/Pagination";
import RowCard from "../components/RowCard/RowCard";
import { isExactMatch } from "../utils/matcher";
import "../App.css";

const buildKey = (r: MappingRow) => `${r.title}|||${r.matched_csv_title}`;
const PAGE_SIZE = 20;

const MappingPage = () => {
    const [rows, setRows] = useState<RowWithStatus[]>([]);
    const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "unmapped">("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<RowWithStatus | null>(null);
    const [infoRow, setInfoRow] = useState<RowWithStatus | null>(null);

    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const res = await fetch("/airba_fresh_almaty_mapped.json");
            const data: MappingRow[] = await res.json();

            const base = data.map((r) => {
                const expected = String(r.title ?? "");
                const actual = String(r.matched_csv_title ?? "");

                let status: StatusType = "wrong";
                let reason = "";

                if (!actual.trim()) {
                    status = "unmapped";
                    reason = "Отсутствует маппинг";
                } else if (isExactMatch(expected, actual)) {
                    status = "correct";
                    reason = "Сопоставлено корректно";
                } else {
                    status = "wrong";
                    reason = detectReason(expected, actual);
                }


                return { ...r, __status: status, __reason: reason };
            });

            // 🔥 грузим Mongo overrides
            const map = await getOverrides();

            const merged = base.map(r => {
                const ov = map.get(buildKey(r));
                return ov ? { ...r, __status: ov.status, __reason: ov.reason } : r;
            });

            setRows(merged);
            setLoading(false);
        })();
    }, []);


    const stats = useMemo(
        () => ({
            total: rows.length,
            correct: rows.filter((r) => r.__status === "correct").length,
            wrong: rows.filter((r) => r.__status === "wrong").length,
            unmapped: rows.filter((r) => r.__status === "unmapped").length,
        }),
        [rows]
    );

    const filtered = useMemo(() => {
        let out = rows;

        if (filter !== "all") out = out.filter((r) => r.__status === filter);

        if (search.trim()) {
            const s = search.toLowerCase();
            out = out.filter(
                (r) =>
                    String(r.title).toLowerCase().includes(s) ||
                    String(r.matched_csv_title).toLowerCase().includes(s)
            );
        }

        return out;
    }, [rows, filter, search]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSave = async (status: StatusType, reason: string) => {
        if (!selected) return;

        await saveOverride(buildKey(selected), status, reason);
        setSelected(null);

        // ⬇ обновляем список из Mongo
        const map = await getOverrides();
        setRows(rows => rows.map(r => {
            const ov = map.get(buildKey(r));
            return ov ? { ...r, __status: ov.status, __reason: ov.reason } : r;
        }));
    };


    const exportCSV = () => {
        const BOM = "\uFEFF";

        const rowsData = filtered.map((r, idx) => ({
            index: idx + 1,
            product_id: r.product_id || "",
            title: r.title || "",
            matched: r.matched_csv_title || "",
            volume: r.volume || "",
            status: r.__status,
            reason: r.__reason,
        }));

        const header = Object.keys(rowsData[0] || {}).join(";");

        const body = rowsData
            .map((row) =>
                Object.values(row)
                    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                    .join(";")
            )
            .join("\n");

        const csv = BOM + header + "\n" + body;

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "mapping_export.csv";
        a.click();
    };
    const detectReason = (expected: string, actual: string): string => {
    const e = expected.toLowerCase();
    const a = actual.toLowerCase();

    // бренды
    const brandTokens = e.split(/\s+/).filter(w =>
        w.length > 2 && /^[a-zа-яё]+$/i.test(w)
    );

    const brandCandidates = brandTokens.filter(w =>
        !["для", "и", "ко", "от", "на", "у", "во"].includes(w)
    );

    const missingBrands = brandCandidates.filter(b => !a.includes(b));
    if (missingBrands.length > 0) {
        return "Неверное сопоставление — отсутствует бренд";
    }

    // объем / вес
    const volumeRegex = /\b(\d+)(ml|мл|g|гр|kg|кг|l|л)\b/i;
    if (volumeRegex.test(e) && !volumeRegex.test(a)) {
        return "Неверное сопоставление — отсутствует объём/вес";
    }

    // жирность/процентность
    const percentRegex = /\b(\d+)%\b/;
    if (percentRegex.test(e) && !percentRegex.test(a)) {
        return "Неверное сопоставление — отсутствует процентность";
    }

    return "Неверное сопоставление";
};


    return (
        <div className="page">
            <header className="header">
                <h1>Проверка маппинга товаров</h1>
            </header>

            <Filters
                filter={filter}
                search={search}
                stats={stats}
                setFilter={setFilter}
                setSearch={setSearch}
                setPage={setPage}
            />

            <section className="card">
                <div className="list-head">Найдено: {total}</div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn" onClick={exportCSV}>Выгрузить CSV</button>
                </div>

                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                <div className="rows">
                    {loading && <div className="empty">Загрузка...</div>}

                    {!loading && paginated.map((r, i) => (
                        <RowCard
                            key={i}
                            r={r}
                            onInfo={setInfoRow}
                            onEdit={setSelected}
                        />
                    ))}

                    {!loading && !paginated.length && (
                        <div className="empty">По заданным фильтрам ничего нет</div>
                    )}
                </div>
            </section>

            {infoRow && <DetailsModalInfo row={infoRow} onClose={() => setInfoRow(null)} />}
            {selected && <DetailsModal row={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
        </div>
    );
};

export default MappingPage;
