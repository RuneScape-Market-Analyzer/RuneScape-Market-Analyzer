import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TopMovers.css';

function TopMovers() {
    const [gainers, setGainers] = useState([]);
    const [decliners, setDecliners] = useState([]);
    const [view, setView] = useState('gainers');

    useEffect(() => {
        const fetchData = async () => {
            const gainersRes = await fetch('http://localhost:5000/items/prices/top-gainers');
            const gainersData = await gainersRes.json();
            setGainers(gainersData);

            const declinersRes = await fetch('http://localhost:5000/items/prices/top-decliners');
            const declinersData = await declinersRes.json();
            setDecliners(declinersData);
        };

        fetchData();
    }, []);

    const formatPrice = (num) => {
        return num.toLocaleString() + ' gp';
    };

    const renderItem = ([id, name, price, change], index) => (
        <motion.div
            key={id}
            className="item-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: 'easeOut'
            }}
        >
            <div className="item-image-wrapper">
                <motion.img
                    src={`https://secure.runescape.com/m=itemdb_rs/obj_sprite.gif?id=${id}`}
                    alt={name}
                    className="item-icon"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: index * 0.2 + 0.3,
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                />
            </div>
            <div className="item-name">{name}</div>
            <div className="item-price">{formatPrice(price)}</div>
            <div className={`item-change ${change >= 0 ? 'gain' : 'decline'}`}>
    <span className="arrow">{change >= 0 ? '▲' : '▼'}</span>
    <span className="percent">{Math.abs(change).toFixed(2)}%</span>
</div>

        </motion.div>
    );

    const itemsToShow = view === 'gainers' ? gainers : decliners;

    return (
        <div className="top-movers new-layout">
            <div className="top-header">
                <h2>Today's Market Trends</h2>
                <div className="toggle-buttons">
                    <button
                        className={view === 'gainers' ? 'active' : ''}
                        onClick={() => setView('gainers')}
                    >
                        Gainers
                    </button>
                    <button
                        className={view === 'decliners' ? 'active' : ''}
                        onClick={() => setView('decliners')}
                    >
                        Decliners
                    </button>
                </div>
            </div>

            <div className="mover-list full">
                <div className="table-header">
                    <div className="header-icon" />
                    <div className="header-name">Item</div>
                    <div className="header-price">Price</div>
                    <div className="header-change">% Change</div>
                </div>
                <AnimatePresence mode="wait">
                    {itemsToShow.map((item, index) => renderItem(item, index))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default TopMovers;
