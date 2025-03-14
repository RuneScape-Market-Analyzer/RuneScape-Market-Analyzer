import React from "react";
import "./FAQ.css";

function FAQ() {
    return (
        <div className="faq-container">
            <h1 className="faq-title">Frequently Asked Questions</h1>
            
            <div className="faq-item">
                <h2 className="faq-question">What is the RuneScape Market Analyzer?</h2>
                <p className="faq-answer">
                    The RuneScape Market Analyzer is a dashboard tool that helps players make informed trading decisions 
                    on the Grand Exchange. It provides historical price data, market trend predictions, and profit 
                    calculation tools to help maximize your in-game trading profits.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">How does the price prediction feature work?</h2>
                <p className="faq-answer">
                    Our price predictions use machine learning models trained on historical Grand Exchange data. 
                    While these predictions can indicate potential market trends, please remember they're not 
                    financial guarantees - always use your own judgment when trading.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">How often is the data updated?</h2>
                <p className="faq-answer">
                    Item prices are updated every 5 minutes using the official Grand Exchange API. Historical data 
                    is maintained in our database and updated daily.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">How do I use the Profit Calculator?</h2>
                <p className="faq-answer">
                    Simply enter an item name, your proposed buy/sell prices, and quantity. The calculator will 
                    automatically show your potential profit/loss after Grand Exchange fees. You can access it 
                    through the "Calculator" tab in the dashboard.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">Can I view historical price data beyond 180 days?</h2>
                <p className="faq-answer">
                    Yes! While the official API only provides 180 days of history, we maintain extended historical 
                    data in our database. Our charts show complete historical data for items we've tracked over time.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">Is my RuneScape account information safe?</h2>
                <p className="faq-answer">
                    Absolutely. We don't require or store any RuneScape account credentials. All data comes from 
                    public APIs, and no personal information is needed to use our analyzer.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">How do I search for a specific item's data?</h2>
                <p className="faq-answer">
                    Use the search bar at the top of any chart page. Start typing an item name and select from the 
                    auto-complete suggestions. You can search for any tradable Grand Exchange item.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">What data sources does the app use?</h2>
                <p className="faq-answer">
                    We use the official RuneScape Grand Exchange API for real-time data and maintain our own SQL 
                    database for historical records. Player statistics come from the official Hiscores API.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">Are the predictions guaranteed to be accurate?</h2>
                <p className="faq-answer">
                    While we use advanced machine learning models, the Grand Exchange is a dynamic player-driven 
                    market. Predictions are educated estimates based on historical patterns, not guarantees. 
                    Always diversify your investments.
                </p>
            </div>

            <div className="faq-item">
                <h2 className="faq-question">How can I contact support?</h2>
                <p className="faq-answer">
                    Have questions or feedback? Email us at support@rsmarketanalyzer.com. For bug reports, 
                    please include your browser version and steps to reproduce the issue.
                </p>
            </div>
        </div>
    );
}

export default FAQ;