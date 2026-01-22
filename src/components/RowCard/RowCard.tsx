import type { RowWithStatus } from "../../types";
import "./RowCard.css";
interface Props {
  r: RowWithStatus;
  onInfo: (r: RowWithStatus) => void;
  onEdit: (r: RowWithStatus) => void;
}

const RowCard = ({ r, onInfo, onEdit }: Props) => {
  return (
    <div className="row-card">
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
        <div className="meta">
          <span className="meta-label">Product ID:</span>
          <span className="meta-value">{r.product_id || "—"}</span>

          {r.product_id && (
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(r.product_id)}>
              Скопировать
            </button>
          )}
        </div>

        <div className="meta">
          <span className="meta-value">{r.volume || ""}</span>
        </div>

        <div className="meta-details">
          <button className="details-btn" onClick={() => onInfo(r)}>
            Подробнее
          </button>

          <button className="details-btn" onClick={() => onEdit(r)}>
            Изменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default RowCard;
