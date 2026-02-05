import { useEffect, useState } from "react";
import "./Checkout.css";

const BASE_PRICE = 4999;

export default function Checkout() {
  /* =========================
     STATE
     ========================= */
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

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
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  /* =========================
     FETCH ADD-ONS
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://localhost:8000/api/store/addons/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setAddons(data);
        } else {
          setAddons([]);
        }
      })
      .catch((err) => {
        console.error("Addon fetch error:", err);
        setAddons([]);
      });
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
     PRICE CALCULATION
     ========================= */
  const addonsTotal = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + Number(a.price), 0);

  const total = BASE_PRICE + addonsTotal;

  /* =========================
     SUBMIT ORDER
     ========================= */
  const submitOrder = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    const payload = {
      ...customer,
      addons: selectedAddons,
    };

    const res = await fetch("http://localhost:8000/api/store/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = `/payment/${data.order_id}`;
    } else {
      alert("Order failed. Please check your details.");
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

        {/* ADD-ONS */}
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

        {/* CUSTOMER DETAILS */}
        <h4>Shipping Details</h4>
        <form className="checkout-form">
          <input
            name="full_name"
            placeholder="Full name"
            value={customer.full_name}
            onChange={handleCustomerChange}
          />
          <input
            name="phone"
            placeholder="Phone number"
            value={customer.phone}
            onChange={handleCustomerChange}
          />
          <textarea
            name="address"
            placeholder="Full address"
            value={customer.address}
            onChange={handleCustomerChange}
          />
          <div className="row">
            <input
              name="city"
              placeholder="City"
              value={customer.city}
              onChange={handleCustomerChange}
            />
            <input
              name="state"
              placeholder="State"
              value={customer.state}
              onChange={handleCustomerChange}
            />
          </div>
          <input
            name="pincode"
            placeholder="Pincode"
            value={customer.pincode}
            onChange={handleCustomerChange}
          />
        </form>

        {/* TOTAL */}
        <div className="order-summary">
          <div className="row total">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>
        </div>

        {/* ACTION */}
        <button className="primary checkout-btn" onClick={submitOrder}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
