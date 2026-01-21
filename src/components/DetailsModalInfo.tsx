import React from "react";
import type { RowWithStatus } from "../types";

type Props = {
  row: RowWithStatus;
  onClose: () => void;
};

const copy = (v: any) => v && navigator.clipboard.writeText(String(v));

const DetailsModalInfo = ({ row, onClose }: Props) => {
  const fields = [
    ["Product ID", row.product_id],
    ["CSV Product ID", row.csv_id],
    ["База ID (Mongo)", row._id],
    ["Название (title)", row.title],
    ["CSV Title", row.matched_csv_title],
    ["Бренд", row.brand],
    ["Объём", row.volumeActual || row.volume || "—"],
    ["Процент", row.percentActual || row.percent || "—"],
    ["Источник", row.source],
    ["Город", row.city],
    ["Наличие", row.inStock],
  ];

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3 style={{ marginTop: 0 }}>Детальная информация</h3>

        <div style={styles.content}>
          {fields.map(([label, value]) => (
            <div key={label} style={styles.row}>
              <div style={styles.label}>{label}</div>
              <div
                style={styles.value}
                onClick={() => copy(value)}
                title="Нажми чтобы скопировать"
              >
                {value ? String(value) : "—"}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <button style={styles.closeBtn} onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },
  modal: {
    background: "#fff",
    width: "520px",
    maxHeight: "80vh",
    overflowY: "auto",
    borderRadius: "14px",
    padding: "20px 22px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
  content: {
    marginTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "6px",
    borderBottom: "1px solid #e5e7eb",
  },
  label: {
    fontSize: "13px",
    color: "#6b7280",
    flex: 1
  },
  value: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#111827",
    cursor: "pointer",
    flex: 1,
    textAlign: "right",
    userSelect: "none"
  },
  footer: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end"
  },
  closeBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: "13px",
    cursor: "pointer"
  }
};

export default DetailsModalInfo;
