import React from "react";
import { useAuth } from "../state/auth.jsx";

export default function Account(){
  const { session } = useAuth();
  return (
    <div className="container section">
      <div className="card" style={{padding:18}}>
        <div className="badge">👤 Account</div>
        <h1 className="h2" style={{margin:"12px 0 6px"}}>Hello, {session?.name}</h1>
        <div className="small">Email: <b>{session?.email}</b> • Role: <b>{session?.role}</b></div>
        <div className="hr" />
        <div className="small">This demo stores users + session in your browser. For real projects, you’d connect a backend (Firebase, Supabase, Node API, etc).</div>
      </div>
    </div>
  );
}
