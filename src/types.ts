export type StatusType = "correct" | "wrong";

export type MappingRow = {
  title?: string | null;
  matched_csv_title?: string | null;
  [key: string]: any;
};

export type RowWithStatus = MappingRow & {
  __status: StatusType;
  __reason: string;
};
