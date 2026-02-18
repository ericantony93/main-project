import { useEffect, useState } from "react";
import "./Checkout.css";

const BASE_PRICE = 4999;

export default function Checkout() {
  /* =========================
     STATE
     ========================= */
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* =========================
     AUTH GUARD
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) window.location.href = "/auth";
  }, []);

  /* =========================
     FETCH ADD-ONS
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://192.168.1.5:8000/api/store/addons/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAddons(Array.isArray(data) ? data : []))
      .catch(() => setAddons([]));
  }, []);

  /* =========================
     HANDLERS
     ========================= */
  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  /* =========================
     PRICE
     ========================= */
  const addonsTotal = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + Number(a.price), 0);

  const total = BASE_PRICE + addonsTotal;

  /* =========================
     VALIDATION (ONLY SHIPPING)
     ========================= */
  const shippingComplete = Object.values(customer).every(
    (value) => value.trim() !== ""
  );

  /* =========================
     SUBMIT ORDER
     ========================= */
  const submitOrder = async () => {
    setError("");

    if (!shippingComplete) {
      setError("Please fill in all shipping details to continue.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    const payload = {
      ...customer,
      addons: selectedAddons, // optional
    };

    const res = await fetch("http://localhost:8000/api/store/order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      setError("Server error. Please try again.");
      return;
    }

    if (res.ok) {
      window.location.href = `/payment/${data.order_id}`;
    } else {
      setError("Order failed. Please check your details.");
      console.error(data);
    }
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">
        <h2>Checkout</h2>
        <p className="subtitle">Review your order and complete purchase</p>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <div className="row">
            <span>Product</span>
            <span>Smart AQI Monitoring System</span>
          </div>
          <div className="row">
            <span>Base Price</span>
            <span>₹ {BASE_PRICE}</span>
          </div>
        </div>

        {/* ADD-ONS (UNCHANGED & OPTIONAL) */}
        <h4>Optional Sensor Add-ons</h4>
        {addons.map((addon) => (
          <div className="addon-item" key={addon.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedAddons.includes(addon.id)}
                onChange={() => toggleAddon(addon.id)}
              />
              {addon.name} <span>+ ₹{addon.price}</span>
            </label>
          </div>
        ))}

        {/* SHIPPING DETAILS (REQUIRED) */}
        <h4>Shipping Details</h4>
        <form className="checkout-form">
          <input name="full_name" placeholder="Full name *" value={customer.full_name} onChange={handleCustomerChange} />
          <input name="phone" placeholder="Phone number *" value={customer.phone} onChange={handleCustomerChange} />
          <textarea name="address" placeholder="Full address *" value={customer.address} onChange={handleCustomerChange} />
          <div className="row">
            <input name="city" placeholder="City *" value={customer.city} onChange={handleCustomerChange} />
            <input name="state" placeholder="State *" value={customer.state} onChange={handleCustomerChange} />
          </div>
          <input name="pincode" placeholder="Pincode *" value={customer.pincode} onChange={handleCustomerChange} />
        </form>

        {/* TOTAL */}
        <div className="order-summary">
          <div className="row total">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primary checkout-btn" onClick={submitOrder}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}