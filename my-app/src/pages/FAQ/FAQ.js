import React from "react";
import { useState } from "react";
import "./FAQ.css";
import"../../index.css";

const faqData = [
    {
      question: "What is the RuneScape Market Analyzer?",
      answer: "The RuneScape Market Analyzer is a dashboard tool that helps players make informed trading decisions on the Grand Exchange. It provides historical price data, market trend predictions, and profit calculation tools to help maximize your in-game trading profits."
    },
    {
      question: "How does the price prediction feature work?",
      answer: "Our price predictions use machine learning models trained on historical Grand Exchange data. While these predictions can indicate potential market trends, please remember they're not financial guarantees - always use your own judgment when trading."
    },
    {
      question: "How often is the data updated?",
      answer: "Item prices are updated every 5 minutes using the official Grand Exchange API. Historical data is maintained in our database and updated daily."
    },
    {
      question: "How do I use the Profit Calculator?",
      answer: "Simply enter an item name, your proposed buy/sell prices, and quantity. The calculator will automatically show your potential profit/loss after Grand Exchange fees. You can access it through the 'Calculator' tab in the dashboard."
    },
    {
      question: "Can I view historical price data beyond 180 days?",
      answer: "Yes! While the official API only provides 180 days of history, we maintain extended historical data in our database. Our charts show complete historical data for items we've tracked over time."
    },
    {
      question: "Is my RuneScape account information safe?",
      answer: "Absolutely. We don't require or store any RuneScape account credentials. All data comes from public APIs, and no personal information is needed to use our analyzer."
    },
    {
      question: "How do I search for a specific item's data?",
      answer: "Use the search bar at the top of any chart page. Start typing an item name and select from the auto-complete suggestions. You can search for any tradable Grand Exchange item."
    },
    {
      question: "What data sources does the app use?",
      answer: "We use the official RuneScape Grand Exchange API for real-time data and maintain our own SQL database for historical records. Player statistics come from the official Hiscores API."
    },
    {
      question: "Are the predictions guaranteed to be accurate?",
      answer: "While we use advanced machine learning models, the Grand Exchange is a dynamic player-driven market. Predictions are educated estimates based on historical patterns, not guarantees. Always diversify your investments."
    },
    {
      question: "How can I contact support?",
      answer: "Have questions or feedback? Email us at support@rsmarketanalyzer.com. For bug reports, please include your browser version and steps to reproduce the issue."
    }
  ];

function FAQ() {
    const [countIndex, setCountIndex] = useState(null);

    const toggleAnswer = (index) => {
        setCountIndex((prev) => (prev === index ? null : index));
      };

    return (
        <div className="faq-container">
          <div className="faq-title">
            <h1 className="global-title">Frequently Asked Questions</h1>
          </div>
          <div className="faq-list">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${countIndex === index ? 'active' : ''}`}
                onClick={() => toggleAnswer(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggleAnswer(index)}
              >
                <div className="faq-question-row">
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon">{countIndex === index ? "−" : "+"}</span>
                </div>
                {countIndex === index && (
                  <p className="faq-answer">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
      
}

export default FAQ;