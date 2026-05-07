export function imageUrl(src){
  if(!src) return "";
  if(/^(https?:|data:|blob:)/i.test(src)) return src;
  const clean = src.startsWith("/") ? src.slice(1) : src;
  return `${import.meta.env.BASE_URL}${clean}`;
}
