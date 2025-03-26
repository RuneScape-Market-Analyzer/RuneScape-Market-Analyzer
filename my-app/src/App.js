import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import Home from "./pages/Home/Home.js";
// import Trading from "./pages/Trading/Trading.js"; --> keeping rn for reference
import News from "./pages/News/News.js";
import FAQ from "./pages/FAQ/FAQ.js";
import Login from "./pages/Login/Login.js";
import Trade from "./pages/Trade/Trade.js";


function App() {
    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #442788, #66264E, #461955)',
                 minHeight: '100vh',
                 color: 'white',
            }}
        > 
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/*<Route path="/trading" element={<Trading />} /> */}
                    <Route path="/news" element={<News />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/trade" element={<Trade />} />
                </Routes>
        </Router>
        </div>
    );
}

export default App;
