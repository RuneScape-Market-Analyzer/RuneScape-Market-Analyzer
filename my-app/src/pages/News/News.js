import React from "react";
import "./News.css";
import "../../index.css";

function News() {

 const featuredNews = {
    id: 0,
    title: "Return to the Desert: Pharaoh's Folly",
    date: "2024-04-06",
    summary:
        "Continuing the story from Beneath Scabaras’ Sands, you’ll journey back to Menaphos, team up with Ozan and Leela to uncover Pharaoh Osman’s betrayal.",
    image:
        "https://cdn.runescape.com/assets/img/external/news/2025/04/pfkey.jpg",
    category: "Featured Update",
    };
    
  const newsItems = [
    {
      id: 1,
      title: "New Elder God Wars Dungeon Update",
      date: "2024-03-15",
      summary: "The final front of the Elder God Wars Dungeon arrives with challenging new bosses and powerful rewards...",
      image: "https://runescape.wiki/images/thumb/The_Croesus_Front_Survival_Guide_(1)_update_image.jpg/1160px-The_Croesus_Front_Survival_Guide_(1)_update_image.jpg",
      category: "Game Update",
    },
    {
      id: 2,
      title: "Double XP Weekend Announced",
      date: "2024-03-12",
      summary: "Prepare your training plans! The next Double XP Weekend will run from March 24th to 28th...",
      image: "https://external-preview.redd.it/Q6md3IHfYgDkCs32DHnAVj5-Fj_XGxv_JIFlTSjSSvQ.jpg?auto=webp&s=515a653678ce9bab4a4b510b5cb85d1516c1ab27",
      category: "Event",
    },
    {
      id: 3,
      title: "Wilderness Rework Proposal",
      date: "2024-03-10",
      summary: "Jagex releases proposed changes to Wilderness PvP mechanics. Player feedback needed...",
      image: "https://runescape.wiki/images/thumb/Wilderness_rework_with_opt-in_PvP_out_now!_-_The_Wilderness_Reborn_(RuneScape).jpg/640px-Wilderness_rework_with_opt-in_PvP_out_now!_-_The_Wilderness_Reborn_(RuneScape).jpg",
      category: "Developer Blog",
    },
  ];

  return (
    <div className="news-container">

    <div className="news-title">
        <h1 className="global-title">RuneScape News & Updates</h1>
    </div>

      <div className="featured-news">
        <div className="featured-text">
          <span className="news-tag">{featuredNews.category}</span>
          <h2 className="news-heading">{featuredNews.title}</h2>
          <p className="news-date">
            {new Date(featuredNews.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="news-summary">{featuredNews.summary}</p>
        </div>
        <div className="featured-image-wrapper">
          <img
            src={featuredNews.image}
            alt={featuredNews.title}
            className="featured-image"
          />
        </div>
      </div>

      <div className="news-section-header">
        <h2 className="news-section-title">Latest News</h2>
        <button className="news-read-more-link">
          Read More <span className="arrow">→</span>
        </button>
      </div>

      <div className="news-grid">
        {newsItems.map((item) => (
          <article key={item.id} className="news-card">
            <img src={item.image} alt={item.title} className="news-image" />
            <div className="news-body">
              <span className="news-tag">{item.category}</span>
              <h2 className="news-heading">{item.title}</h2>
              <p className="news-date">
                {new Date(item.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="news-summary">{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default News;
