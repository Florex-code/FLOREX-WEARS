import React from "react";
import { load, save } from "../utils/storage.js";
const Ctx = React.createContext(null);

export function ThemeProvider({ children }){
  const [theme, setTheme] = React.useState(() => load("fxw_theme", "dark"));
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    save("fxw_theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");
  return <Ctx.Provider value={{ theme, setTheme, toggleTheme }}>{children}</Ctx.Provider>;
}
export function useTheme(){
  const ctx = React.useContext(Ctx);
  if(!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
