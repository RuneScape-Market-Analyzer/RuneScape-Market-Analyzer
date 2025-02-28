import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trading from "./pages/Trading";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trading" element={<Trading />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
