import React from "react";
import type { RowWithStatus } from "../types";

type Props = {
  row: RowWithStatus;
  onClose: () => void;
};

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
    // ⬇⬇⬇ BACKDROP — закрываем по клику
    <div style={backdrop} onClick={onClose}>
      {/* ⬇⬇⬇ MODAL — стопим клик, чтобы не закрывалась */}
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h3>Детальная информация</h3>

        <div style={{ marginTop: 12 }}>
          {fields.map(([label, value]) => (
            <div key={label} style={rowStyle}>
              <span style={labelStyle}>{label}</span>
              <span style={valueStyle}>{String(value)}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "right", marginTop: 16 }}>
        </div>
      </div>
    </div>
  );
};

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  cursor: "pointer"
} as const;

const modal = {
  background: "#fff",
  padding: "18px 20px",
  borderRadius: "12px",
  width: "460px",
  maxHeight: "80vh",
  overflowY: "auto",
  cursor: "default"
} as const;

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #e5e7eb"
} as const;

const labelStyle = {
  fontSize: "13px",
  color: "#6b7280"
} as const;

const valueStyle = {
  fontSize: "13px",
  fontWeight: 500
} as const;

export default DetailsModalInfo;
