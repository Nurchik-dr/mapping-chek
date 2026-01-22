import React from "react";
import "./Pagination.css";
interface Props {
  page: number;
  totalPages: number;
  setPage: (v: any) => void;
}

const Pagination = ({ page, totalPages, setPage }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button className="btn" disabled={page === 1} onClick={() => setPage(1)}>
        « В начало
      </button>

      <button className="btn" disabled={page === 1} onClick={() => setPage((p: number) => p - 1)}>
        ← Назад
      </button>

      <span className="page-info">{page} / {totalPages}</span>

      <button className="btn" disabled={page === totalPages} onClick={() => setPage((p: number) => p + 1)}>
        Вперёд →
      </button>

      <button className="btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
        В конец »
      </button>
    </div>
  );
};

export default Pagination;
