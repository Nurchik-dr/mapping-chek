import React from "react";
import type { StatusType } from "../../types";
import "./Filters.css";
interface Props {
  filter: "all" | StatusType | "unmapped";
  search: string;
  stats: { total: number; correct: number; wrong: number; unmapped: number };
  setFilter: (v: any) => void;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
}

const Filters = ({ filter, search, stats, setFilter, setSearch, setPage }: Props) => {
  return (
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
  );
};

export default Filters;
