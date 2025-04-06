import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-text">© {new Date().getFullYear()} RuneScape Fan Site. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/trade">Trade</a>
          <a href="/news">News</a>
          <a href="/faq">FAQ</a>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
