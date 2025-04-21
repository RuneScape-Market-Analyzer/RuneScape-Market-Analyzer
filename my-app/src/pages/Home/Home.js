import React from "react";
import { useNavigate } from "react-router-dom";
import News from "../News/News.js";
import './Home.css';
import TopMovers from "./TopMovers";
import HotItems from "./HotItems";

function Home() {
    const navigate = useNavigate();

    const handleTrading = () => {
        navigate('/trade');
    };
    const handleNews = () => {
        navigate('/news');
    };
    const handleFAQ = () => {
        navigate('/faq');
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div className="trading-container">
                <div className="top-section">
                    <div className="left-content">
                        <div className="left-content-inner">
                            <h1>Stay Updated with Your Gaming Stats</h1>
                            <p>
                                Discover your RuneScape trading graph, and price analysis
                            </p>
                            <button className="navigate-button" onClick={handleTrading}>
                                Explore More
                            </button>
                        </div>
                    </div>
                    <div className="right-content">
                        <TopMovers />
                    </div>
                </div>
                <div className="hot-items-header">
                <h1>Hot Items Today</h1>
                </div>
                <HotItems />
            </div>

            <div className="news-container">
                <News />
                <button className="navigate-button" onClick={handleNews}>
                    View All
                </button>
            </div>

            <div className="faq-container">
                <h1>Have Questions?</h1>
                <p>
                    Check out our FAQ section!
                </p>
                <button className="navigate-button" onClick={handleFAQ}>
                    View All
                </button>
            </div>
        </div>
    );
}

export default Home;
