import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'; // Import the CSS file
import logo from '../../assets/images/RuneScape.png';


const Navbar = () => (
    <nav className="navbar">
        <div className="logo">
            <img src={logo} alt="Logo" /> 
        </div>

        <ul className="nav-links">
            {[
                { name: "Home", path: "/" },
                //{ name: "Trading", path: "/trading" },
                { name: "Trade", path: "/trade" },
                { name: "News", path: "/news" },
                { name: "FAQ", path: "/faq" },
                //{ name: "Login", path: "/login" },
            ].map((item) => (
                <li key={item.name}>
                    <Link to={item.path} className="nav-link">
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
);

export default Navbar;
