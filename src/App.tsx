// filepath: c:\MiniProject\agri-assist-village\src\App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./components/Toast";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            {/* Fallback route */}
            <Route path="*" element={<Index />} />
          </Routes>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;