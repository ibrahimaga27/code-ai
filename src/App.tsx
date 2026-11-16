import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Builder from "./pages/Builder";
import Projects from "./pages/Projects";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/olustur" element={<Builder />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/projeler" element={<Projects />} />
        <Route path="/odeme" element={<Checkout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
