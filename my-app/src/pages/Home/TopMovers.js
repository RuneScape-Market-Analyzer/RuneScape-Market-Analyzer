import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TopMovers.css';

function TopMovers() {
    const [gainers, setGainers] = useState([]);
    const [decliners, setDecliners] = useState([]);
    const [volume, setVolume] = useState([]);
    const [view, setView] = useState('volume');

    useEffect(() => {
        const fetchData = async () => {
            const gainersRes = await fetch('http://localhost:5000/items/prices/top-gainers');
            const gainersData = await gainersRes.json();
            setGainers(gainersData);

            const declinersRes = await fetch('http://localhost:5000/items/prices/top-decliners');
            const declinersData = await declinersRes.json();
            setDecliners(declinersData);

            const volumeRes = await fetch('http://localhost:5000/items/prices/greatest_volume');
            const volumeData = await volumeRes.json();
            setVolume(volumeData);
        };

        fetchData();
    }, []);

    const formatPrice = (num) => `${num.toLocaleString()} gp`;
    const formatVolume = (num) => `${num.toLocaleString()}x`;

    const renderItem = ([id, name, price, metric], index) => (
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
            {view === 'volume' ? (
                <div className="item-change volume-text">
                    {formatVolume(metric)}
                </div>
            ) : (
                <div className={`item-change ${metric >= 0 ? 'gain' : 'decline'}`}>
                    <span className="arrow">{metric >= 0 ? '▲' : '▼'}</span>
                    <span className="percent">{Math.abs(metric).toFixed(2)}%</span>
                </div>
            )}
        </motion.div>
    );

    const itemsToShow =
        view === 'gainers'
            ? gainers
            : view === 'decliners'
            ? decliners
            : volume;

    const headerTitle =
        view === 'gainers'
            ? "Today's Top Gainers"
            : view === 'decliners'
            ? "Today's Top Decliners"
            : "Today's Market Trends";

    const subheaderText =
        view === 'gainers'
            ? "Showing top 5 items by percent gained"
            : view === 'decliners'
            ? "Showing top 5 items by percent declined"
            : "Showing most traded items by volume";

    return (
        <div className="top-movers new-layout">
            <div className="top-header">
                <div className="header-text">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={headerTitle}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3 }}
                        >
                            {headerTitle}
                        </motion.h2>
                    </AnimatePresence>
                    <motion.p
                        key={subheaderText}
                        className="subheader"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                    >
                        {subheaderText}
                    </motion.p>
                </div>

                <div className="toggle-buttons">
                    <button
                        className={view === 'volume' ? 'active volume-active' : ''}
                        onClick={() => setView('volume')}
                    >
                        Volume
                    </button>
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
                    <div className="header-change">
                        {view === 'volume' ? 'Volume' : '% Change'}
                    </div>
                </div>
                <AnimatePresence mode="wait">
                    {itemsToShow.map((item, index) => renderItem(item, index))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default TopMovers;
