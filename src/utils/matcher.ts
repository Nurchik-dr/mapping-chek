export const normalize = (str: string): string =>
  str
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/(\d+)(шт|шт\.|г|гр|кг|kg|ml|мл|л|l)/gi, "$1 $2")
    .replace(/(\d+(?:\.\d+)?)%/g, "$1 %")
    .replace(/[^\p{L}\p{N}\s%\.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (str: string): string[] =>
  normalize(str).split(" ").filter(Boolean).sort();

export const isExactMatch = (expected: string, actual: string): boolean => {
  const t1 = tokenize(expected);
  const t2 = tokenize(actual);
  if (t1.length !== t2.length) return false;
  for (let i = 0; i < t1.length; i++) {
    if (t1[i] !== t2[i]) return false;
  }
  return true;
};
