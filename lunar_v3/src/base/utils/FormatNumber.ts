function formatNumber(num: number): string {
  if (num < 1000) return num.toString();

  const units = ["", "k", "M", "B", "T"];
  const order = Math.floor(Math.log10(num) / 3); // cada 3 casas → nova unidade
  const unit = units[order];
  const scaled = num / Math.pow(1000, order);

  return scaled % 1 === 0
    ? scaled.toString() + unit
    : scaled.toFixed(1) + unit; // ex: 1.1k
}
export default formatNumber;