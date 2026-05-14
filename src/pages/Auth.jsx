import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { useToast } from "../ui/toast.jsx";

export default function Auth(){
  const { register, login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/";

  const [mode, setMode] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function submit(e){
    e.preventDefault();
    const res = mode === "login"
      ? login({ email, password })
      : register({ name, email, password });

    if(!res.ok){ toast.push(res.message, "bad"); return; }
    toast.push(res.message, "good");
    nav(from);
  }

  return (
    <div className="container section">
      <div className="grid" style={{gridTemplateColumns:"1.05fr .95fr", gap:16}}>
        <div className="card" style={{padding:18}}>
          <div className="badge">🔐 Auth • Protected Checkout • Admin Dashboard</div>
          <h1 className="h2" style={{margin:"12px 0 6px"}}>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <div className="small">Demo authentication stored in your browser (LocalStorage).</div>

          <form onSubmit={submit} style={{marginTop:14}}>
            {mode === "register" ? (
              <>
                <div className="small">Name</div>
                <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />
                <div style={{height:10}} />
              </>
            ) : null}

            <div className="small">Email</div>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />

            <div style={{height:10}} />
            <div className="small">Password</div>
            <input className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" type="password" />

            <div className="row" style={{marginTop:14}}>
              <button className="btn primary" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
              <button className="btn ghost" type="button" onClick={()=>setMode(m=>m==="login"?"register":"login")}>
                Switch to {mode === "login" ? "Register" : "Login"}
              </button>
            </div>

            <div className="hr" />
            <div className="small">Admin access is reserved for the Avenoir team.</div>
          </form>
        </div>

        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:900}}>Why login?</div>
          <div className="small" style={{marginTop:8}}>So checkout stays protected, and admin tools stay admin-only.</div>
          <div className="hr" />
          <div className="small">After login, you’ll be redirected back to: <b>{from}</b></div>
          <div className="hr" />
          <div className="badge">✨ Tip: press Ctrl + K to search products</div>
        </div>
      </div>
    </div>
  );
}
