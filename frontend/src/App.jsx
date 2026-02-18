import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Buy from "./pages/buy";
import Auth from "./pages/Auth";
import Checkout from "./pages/checkout";
import LiveDemo from "./pages/Livedemo";
import Payment from "./pages/payment";
import Success from "./pages/success";

export default function App() {
  return (
    <>
      {/* FULL WIDTH NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/demo" element={<LiveDemo />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  );
}