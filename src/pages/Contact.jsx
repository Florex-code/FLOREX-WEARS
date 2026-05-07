import React from "react";
import { useToast } from "../ui/toast.jsx";

export default function Contact(){
  const toast = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState("");

  function send(e){
    e.preventDefault();
    if(!name || !email || !msg){ toast.push("Please fill the form.", "bad"); return; }
    setName(""); setEmail(""); setMsg("");
    toast.push("Message sent (demo).", "good");
  }

  return (
    <div className="container section">
      <div className="grid" style={{gridTemplateColumns:"1.05fr .95fr", gap:16}}>
        <div className="card" style={{padding:18}}>
          <div className="badge">📩 Contact</div>
          <h1 className="h2" style={{margin:"12px 0 8px"}}>Let’s talk</h1>
          <form onSubmit={send}>
            <div className="small">Name</div>
            <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
            <div style={{height:10}} />
            <div className="small">Email</div>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div style={{height:10}} />
            <div className="small">Message</div>
            <textarea className="textarea" rows="5" value={msg} onChange={(e)=>setMsg(e.target.value)} />
            <div className="row" style={{marginTop:14}}>
              <button className="btn primary" type="submit">Send</button>
              <span className="badge">Demo form</span>
            </div>
          </form>
        </div>

        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:900}}>Store info</div>
          <div className="hr" />
          <div className="small">Email: <b>florexstudio.ng@gmail.com</b></div>
          <div className="small" style={{marginTop:6}}>Location: <b>Lagos</b></div>
          <div className="hr" />
          <a
  href="https://wa.me/2349138465408?text=Hi%20FLOREX-WEARS%2C%20I%20want%20to%20make%20an%20enquiry"
  target="_blank"
  rel="noreferrer"
  className="btn whatsapp-btn"
>
  💬 Chat on WhatsApp
</a>
        </div>
      </div>
    </div>
  );
}
