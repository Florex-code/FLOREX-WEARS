import React from "react";
import "../styles/modal.css";
export default function Modal({ open, title, children, onClose, footer }){
  React.useEffect(() => {
    function onKey(e){ if(e.key === "Escape") onClose?.(); }
    if(open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if(!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modalTop">
          <div className="modalTitle">{title}</div>
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modalBody">{children}</div>
        {footer ? <div className="modalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}
