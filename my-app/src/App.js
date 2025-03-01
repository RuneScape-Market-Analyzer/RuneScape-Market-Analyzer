import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import Home from "./pages/Home/Home.js";
import Trading from "./pages/Trading/Trading.js";
import News from "./pages/News/News.js";
import Search from "./pages/Search/Search.js";
import FAQ from "./pages/FAQ/FAQ.js";
import Login from "./pages/Login/Login.js";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/search" element={<Search />} />
                <Route path="/news" element={<News />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
