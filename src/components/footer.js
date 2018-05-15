import React from 'react';

import trelloPowered from "../assets/trello-powered.png"

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="section"></div>
                <div className="section"></div>
                <div className="section">
                    <a href="https://trello.com/iamolly/recommend"><img src={trelloPowered} alt="Powered by Trello" /></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;