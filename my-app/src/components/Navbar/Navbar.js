import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
    <nav style={{ backgroundColor: "#333", padding: "10px" }}>
        <ul
            style={{
                display: "flex",
                listStyleType: "none",
                margin: 0,
                padding: 0,
                justifyContent: "center",
                gap: "40px",
            }}
        >
            {[
                { name: "Home", path: "/" },
                { name: "Trading", path: "/trading" },
                { name: "Search", path: "/search" },
                { name: "News", path: "/news" },
                { name: "FAQ", path: "/faq" },
                { name: "Login", path: "/login" },
            ].map((item) => (
                <li key={item.name} style={{ color: "#fff", cursor: "pointer" }}>
                    <Link to={item.path} style={{ color: "inherit", textDecoration: "none" }}>
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
);

export default Navbar;
