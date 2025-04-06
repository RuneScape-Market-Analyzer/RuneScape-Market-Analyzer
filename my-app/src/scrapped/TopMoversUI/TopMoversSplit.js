import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TopMovers.css';

function TopMovers() {
    const [gainers, setGainers] = useState([]);
    const [decliners, setDecliners] = useState([]);

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

    const renderItem = ([id, name, price, change], index) => (
        <motion.div
            key={id}
            className="item-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.15,
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
                        delay: index * 0.25 + 0.5,
                        duration: 0.4,
                        ease: 'easeOut'
                    }}
                />
            </div>

            <div className="item-name">{name}</div>
            <div className={`item-change ${change >= 0 ? 'gain' : 'decline'}`}>
                {change.toFixed(2)}%
            </div>
        </motion.div>
    );

    return (
        <div className="top-movers">
            <h2>Today’s Market Trends</h2>
            <div className="movers-section">
                <div className="mover-list">
                    <h3 className="section-title gainers-title">Top Gainers</h3>
                    <AnimatePresence>
                        {gainers.map((item, index) => renderItem(item, index))}
                    </AnimatePresence>
                </div>
                <div className="mover-list">
                    <h3 className="section-title decliners-title">Top Decliners</h3>
                    <AnimatePresence>
                        {decliners.map((item, index) => renderItem(item, index))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default TopMovers;
