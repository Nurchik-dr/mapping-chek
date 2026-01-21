import { useState } from "react";
import type { RowWithStatus, StatusType } from "../types";

type Props = {
  row: RowWithStatus;
  onClose: () => void;
  onSave: (status: StatusType, reason: string) => void;
};

const DetailsModal = ({ row, onClose, onSave }: Props) => {
  const [status, setStatus] = useState<StatusType>(row.__status);
  const [reason, setReason] = useState(row.__reason);

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3>Редактирование</h3>

        <p><b>Фактическое:</b> {row.title}</p>
        <p><b>CSV:</b> {row.matched_csv_title}</p>

        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="radio"
              checked={status === "correct"}
              onChange={() => setStatus("correct")}
            />{" "}
            Правильный
          </label>
          <br />
          <label>
            <input
              type="radio"
              checked={status === "wrong"}
              onChange={() => setStatus("wrong")}
            />{" "}
            Неправильный
          </label>
          <br />
          <label>
            <input
              type="radio"
              checked={status === "unmapped"}
              onChange={() => setStatus("unmapped")}
            />{" "}
            Не замаплен
          </label>
        </div>

        <textarea
          style={styles.textarea}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div style={styles.actions}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={() => onSave(status, reason)}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    width: "420px",
  },
  textarea: {
    width: "100%",
    height: "60px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    padding: "6px"
  },
  actions: {
    marginTop: "14px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px"
  }
};

export default DetailsModal;
