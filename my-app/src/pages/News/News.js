import React from "react";
import "./News.css";

function News() {
    // Temporary mock news data
    const newsItems = [
        {
            id: 1,
            title: "New Elder God Wars Dungeon Update",
            date: "2024-03-15",
            summary: "The final front of the Elder God Wars Dungeon arrives with challenging new bosses and powerful rewards...",
            image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frunescape.wiki%2Fimages%2Fthumb%2FThe_Croesus_Front_Survival_Guide_(1)_update_image.jpg%2F1160px-The_Croesus_Front_Survival_Guide_(1)_update_image.jpg%3F36957&f=1&nofb=1&ipt=7d4c3fde742192c122f7158eb840e8c6150345b70d1778a8cbac1a99bfcb53a7&ipo=images"
        },
        {
            id: 2,
            title: "Double XP Weekend Announced",
            date: "2024-03-12",
            summary: "Prepare your training plans! The next Double XP Weekend will run from March 24th to 28th...",
            image: "https://external-preview.redd.it/Q6md3IHfYgDkCs32DHnAVj5-Fj_XGxv_JIFlTSjSSvQ.jpg?auto=webp&s=515a653678ce9bab4a4b510b5cb85d1516c1ab27"
        },
        {
            id: 3,
            title: "Wilderness Rework Proposal",
            date: "2024-03-10",
            summary: "Jagex releases proposed changes to Wilderness PvP mechanics. Player feedback needed...",
            image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frunescape.wiki%2Fimages%2Fthumb%2FWilderness_rework_with_opt-in_PvP_out_now!_-_The_Wilderness_Reborn_(RuneScape).jpg%2F640px-Wilderness_rework_with_opt-in_PvP_out_now!_-_The_Wilderness_Reborn_(RuneScape).jpg%3F315e5&f=1&nofb=1&ipt=017b00ff64507a416391bd345912bd57af759b62e0b196f379b74dbaf6f44e91&ipo=images"
        }
    ];

    return (
        <div className="news-container">
            <h1 className="news-header">RuneScape News & Updates</h1>
            <div className="news-grid">
                {newsItems.map(item => (
                    <div key={item.id} className="news-card">
                        <img src={item.image} alt={item.title} className="news-image" />
                        <div className="news-content">
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-date">{new Date(item.date).toLocaleDateString()}</p>
                            <p className="news-summary">{item.summary}</p>
                            <button className="news-read-more">Read More</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default News;