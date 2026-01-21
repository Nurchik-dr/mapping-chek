import { useEffect, useMemo, useState } from "react";
import { isExactMatch } from "./utils/matcher";
import { listenOverrides, saveOverride } from "./utils/firestoreOverrides";
import type { RowWithStatus, MappingRow, StatusType } from "./types";
import DetailsModal from "./components/DetailsModal";
import "./App.css"; // <-- стили из ПЕРВОГО проекта

const buildKey = (r: MappingRow) => `${r.title}|||${r.matched_csv_title}`;
const PAGE_SIZE = 20;

const App = () => {
  const [rows, setRows] = useState<RowWithStatus[]>([]);
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "unmapped">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RowWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let unsub: any = null;

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
          reason = "Нет замапленного товара";
        } else if (isExactMatch(expected, actual)) {
          status = "correct";
          reason = "Совпадает после нормализации";
        } else {
          status = "wrong";
          reason = "Не совпадает после нормализации";
        }

        return { ...r, __status: status, __reason: reason };
      });

      setRows(base);
      setLoading(false);

      unsub = listenOverrides((map) => {
        setRows((old) =>
          old.map((r) => {
            const key = buildKey(r);
            const ov = map.get(key);
            if (!ov) return r;
            return { ...r, __status: ov.status, __reason: ov.reason };
          })
        );
      });
    })();

    return () => unsub && unsub();
  }, []);

  const stats = useMemo(() => ({
    total: rows.length,
    correct: rows.filter((r) => r.__status === "correct").length,
    wrong: rows.filter((r) => r.__status === "wrong").length,
    unmapped: rows.filter((r) => r.__status === "unmapped").length,
  }), [rows]);

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
  };

  const exportCSV = () => {
  const BOM = "\uFEFF"; // важный момент!

  const rowsData = filtered.map((r, idx) => ({
    index: idx + 1,
    product_id: r.product_id || "",
    title: r.title || "",
    matched: r.matched_csv_title || "",
    volume: r.volume || "",
    status: r.__status,
    reason: r.__reason
  }));

  const header = Object.keys(rowsData[0] || {}).join(";");

  const body = rowsData
    .map(row =>
      Object.values(row)
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
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


  return (
    <div className="page">
      <header className="header">
        <h1>Проверка маппинга товаров</h1>
      </header>

      <section className="card controls-card">
        <div className="controls-row">
          <div className="field">
            <label>Фильтр по статусу</label>
            <div className="chips">
              <button className={`chip ${filter === "all" ? "chip-active" : ""}`} onClick={() => { setFilter("all"); setPage(1); }}>
                Все ({stats.total})
              </button>
              <button className={`chip ${filter === "correct" ? "chip-active" : ""}`} onClick={() => { setFilter("correct"); setPage(1); }}>
                ✔ Правильные ({stats.correct})
              </button>
              <button className={`chip ${filter === "wrong" ? "chip-active" : ""}`} onClick={() => { setFilter("wrong"); setPage(1); }}>
                ✖ Неправильные ({stats.wrong})
              </button>
              <button className={`chip ${filter === "unmapped" ? "chip-active" : ""}`} onClick={() => { setFilter("unmapped"); setPage(1); }}>
                ⚠ Не замапленные ({stats.unmapped})
              </button>
            </div>
          </div>

          <div className="field">
            <label>Поиск</label>
            <input
              className="input"
              placeholder="Название..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <div className="list-head">Найдено: {total}</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button className="btn" onClick={exportCSV}>Выгрузить CSV</button>
        </div>

        <div className="rows">
          {loading && <div className="empty">Загрузка...</div>}

          {!loading && paginated.map((r, i) => (
            <div className="row-card" key={i}>
              <div className="row-main">
                <div className="titles">
                  <div className="title-block">
                    <div className="title-label">Ожидаемое название</div>
                    <div className="title-value">{r.title}</div>
                  </div>

                  <div className="title-block">
                    <div className="title-label">Замапленное название</div>
                    <div className="title-value alt">{r.matched_csv_title || "—"}</div>
                  </div>
                </div>

                <div className="status-block">
                  {r.__status === "correct" && <div className="status-pill" style={{ background: "#059669" }}>Правильно</div>}
                  {r.__status === "wrong" && <div className="status-pill" style={{ background: "#b91c1c" }}>Неправильно</div>}
                  {r.__status === "unmapped" && <div className="status-pill" style={{ background: "#d97706" }}>Не замаплено</div>}
                  <div className="status-reason">{r.__reason}</div>
                </div>
              </div>

              <div className="row-extra">
                <div className="meta"><span className="meta-label">Product ID:</span><span className="meta-value">{r.product_id || "—"}</span></div>
                <div className="meta"><span className="meta-label"></span><span className="meta-value">{r.volume || ""}</span></div>

                <button className="details-btn" onClick={() => setSelected(r)}>Изменить</button>
              </div>
            </div>
          ))}

          {!loading && !paginated.length && (
            <div className="empty">По заданным фильтрам ничего нет</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
            <span className="page-info">{page} / {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Вперёд →</button>
          </div>
        )}
      </section>

      {selected && (
        <DetailsModal
          row={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default App;
