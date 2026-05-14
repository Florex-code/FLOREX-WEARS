import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { supabase } from "../lib/supabase.js";
import { money } from "../utils/money.js";

export default function Account(){
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = React.useState([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);

  React.useEffect(() => {
    let ignore = false;

    async function loadOrders(){
      if(!user?.email){
        setLoadingOrders(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false })
        .limit(3);

      if(!ignore){
        setOrders(error ? [] : data || []);
        setLoadingOrders(false);
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [user?.email]);

  const emailName = user?.email?.split("@")[0] || "there";
  const displayName = user?.user_metadata?.full_name || emailName;
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="accountPage">
      <div className="container section">
        <section className="accountHero">
          <div className="accountIdentity">
            <div className="accountAvatar">{displayName.slice(0, 1).toUpperCase()}</div>
            <div>
              <div className="badge">My Account</div>
              <h1 className="accountTitle">Welcome back, {displayName}</h1>
              <p className="accountSubtitle">
                Track your orders, continue shopping, and keep your Avenoir experience smooth.
              </p>
            </div>
          </div>

          <div className="accountHeroActions">
            <Link className="btn primary" to="/shop">Shop new pieces</Link>
            <Link className="btn ghost" to="/contact">Need help?</Link>
          </div>
        </section>

        <div className="accountGrid">
          <section className="card accountPanel">
            <div className="accountPanelHeader">
              <h2>Profile</h2>
              <span className="accountStatus">{isAdmin ? "Admin" : "Customer"}</span>
            </div>

            <div className="accountInfoList">
              <div className="accountInfoItem">
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>
              <div className="accountInfoItem">
                <span>Role</span>
                <strong>{isAdmin ? "Store admin" : "Customer account"}</strong>
              </div>
              <div className="accountInfoItem">
                <span>Joined</span>
                <strong>{joined}</strong>
              </div>
            </div>
          </section>

          <section className="card accountPanel">
            <div className="accountPanelHeader">
              <h2>Quick Actions</h2>
            </div>

            <div className="accountActionGrid">
              <Link to="/shop" className="accountAction">
                <strong>Browse collection</strong>
                <span>Find new drops and best sellers.</span>
              </Link>
              <Link to="/checkout" className="accountAction">
                <strong>Go to checkout</strong>
                <span>Finish an order already in your cart.</span>
              </Link>
              <Link to="/contact" className="accountAction">
                <strong>Ask for support</strong>
                <span>Get help with sizing, payment, or delivery.</span>
              </Link>
              {isAdmin ? (
                <Link to="/admin" className="accountAction">
                  <strong>Admin dashboard</strong>
                  <span>Manage products and store orders.</span>
                </Link>
              ) : null}
            </div>
          </section>

          <section className="card accountPanel accountOrders">
            <div className="accountPanelHeader">
              <h2>Recent Orders</h2>
              <span className="accountStatus">{orders.length} shown</span>
            </div>

            {loadingOrders ? (
              <div className="accountEmpty">Loading your orders...</div>
            ) : orders.length ? (
              <div className="accountOrderList">
                {orders.map((order) => (
                  <div className="accountOrder" key={order.id}>
                    <div>
                      <strong>{order.payment_reference || `Order #${order.id}`}</strong>
                      <span>{order.status || "processing"}</span>
                    </div>
                    <div className="price">{money(order.total)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="accountEmpty">
                <strong>No orders yet</strong>
                <span>Your completed orders will appear here after checkout.</span>
                <Link className="btn primary" to="/shop">Start shopping</Link>
              </div>
            )}
          </section>

          <section className="card accountPanel accountCare">
            <div className="accountPanelHeader">
              <h2>Customer Care</h2>
            </div>
            <p>
              Need sizing advice or delivery confirmation? Message Avenoir and we will help you choose right.
            </p>
            <a
              className="btn primary"
              href="https://wa.me/2349138465408?text=Hi%20Avenoir%2C%20I%20need%20help%20with%20my%20account"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
