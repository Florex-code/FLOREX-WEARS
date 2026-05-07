export function money(n){
  const num = Number(n || 0);
  return "₦" + num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
