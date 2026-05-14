export function money(n){
  const num = Number(n || 0);
  return "\u20a6" + num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
