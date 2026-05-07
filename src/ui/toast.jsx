import React from "react";
import "../styles/toast.css";
const Ctx = React.createContext(null);

export function ToastProvider({ children }){
  const [toasts, setToasts] = React.useState([]);

  function push(message, type="info"){
    const id = crypto.randomUUID();
    setToasts(t => [{ id, message, type }, ...t].slice(0, 4));
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="toastHost" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={"toast " + t.type}>
            <div className="toastDot" />
            <div className="toastMsg">{t.message}</div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(){
  const ctx = React.useContext(Ctx);
  if(!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
