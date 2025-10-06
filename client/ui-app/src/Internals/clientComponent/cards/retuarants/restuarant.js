import React from 'react';
import './restuarants.css';
import AllaboutFood from "../../../../assets/cards/background.jpg"; 

import IndianFlavours from "../../../../assets/cards/restuarants/indian.jpg";
import Global from "../../../../assets/cards/restuarants/world_food.jpg";
import NightLife from "../../../../assets/cards/restuarants/night_life.png";
import QuickBites from "../../../../assets/cards/restuarants/quick_bites.jpg"; 
import SweetTooth from "../../../../assets/cards/restuarants/sweet_tooth.jpg"; 
import Foodie from "../../../../assets/cards/restuarants/foodie.png"; 


const RestuarantCards = () => {
    return (
        <div className="restaurant-page-container">

            <header className="hero-banner" style={{ backgroundImage: `url(${AllaboutFood})` }}>
                <div className="hero-overlay"></div>
                <h1 className="hero-title">IT'S ALL ABOUT FOOD</h1>
                <div className="hero-actions">

                    <div className="action-card booking">
                        <span className="icon">😀</span>
                        <p className="title">Book A Table</p>
                        <p className="subtitle">Make Reservation</p>
                    </div>

                    <div className="action-card trending">
                        <span className="icon">🍲</span>
                        <p className="title">WHAT'S TRENDING?</p>
                        <p className="subtitle">Try It Yourself</p>
                    </div>

                    <div className="action-card ordering">
                        <span className="icon">🛵</span>
                        <p className="title">ORDER FOOD</p>
                    </div>
                </div>
            </header>

            <section className="category-cards-section">
                <div className="cards-grid">

                    {/* Card 1: Indian Flavours */}
                    <div className="category-card indian-flavours">
                        {/* Image set directly using inline style */}
                        <div
                            className="card-image-wrapper"
                            style={{ backgroundImage: `url(${IndianFlavours})` }}
                        ></div>
                        <div className="card-content">
                            <h3 className="card-title">Indian Flavours</h3>
                            <ul className="category-list">
                                <li>- Chettinad</li>
                                <li>- South Indian</li>
                                <li>- Pure Veg</li>
                                <li>- Biryani</li>
                            </ul>
                            <a href="#" className="more-link">- More</a>
                        </div>
                    </div>

                    {/* Card 2: Global Cuisines */}
                    <div className="category-card global-cuisines">
                        {/* Image set directly using inline style */}
                        <div
                            className="card-image-wrapper"
                            style={{ backgroundImage: `url(${Global})` }}
                        ></div>
                        <div className="card-content">
                            <h3 className="card-title">Global Cuisines</h3>
                            <ul className="category-list">
                                <li>- Afghani</li>
                                <li>- Thai</li>
                                <li>- Continental</li>
                                <li>- Mexican</li>
                            </ul>
                            <a href="#" className="more-link">- More</a>
                        </div>
                    </div>

                    {/* Card 3: Nightlife */}
                    <div className="category-card nightlife">
                        {/* Image set directly using inline style */}
                        <div
                            className="card-image-wrapper"
                            style={{ backgroundImage: `url(${NightLife})` }}
                        ></div>
                        <div className="card-content">
                            <h3 className="card-title">Nightlife</h3>
                            <ul className="category-list">
                                <li>- Pubs</li>
                                <li>- Discotheques</li>
                                <li>- Lounge Bars</li>
                                <li>- Restaurants & Bars</li>
                            </ul>
                            <a href="#" className="more-link">- More</a>
                        </div>
                    </div>

                    {/* Card 4: Quick Bites */}
                    <div className="category-card quick-bites">
                        {/* Image set directly using inline style */}
                        <div
                            className="card-image-wrapper"
                            style={{ backgroundImage: `url(${QuickBites})` }}
                        ></div>
                        <div className="card-content">
                            <h3 className="card-title">Quick Bites</h3>
                            <ul className="category-list">
                                <li>- Bakeries</li>
                                <li>- Coffee Shops</li>
                                <li>- Fast Food</li>
                                <li>- Pizza Outlets</li>
                            </ul>
                            <a href="#" className="more-link">- More</a>
                        </div>
                    </div>

                    {/* Card 5: Sweet Tooth */}
                    <div className="category-card sweet-tooth">
                        {/* Image set directly using inline style */}
                        <div
                            className="card-image-wrapper"
                            style={{ backgroundImage: `url(${SweetTooth})` }}
                        ></div>
                        <div className="card-content">
                            <h3 className="card-title">Sweet Tooth</h3>
                            <ul className="category-list">
                                <li>- Cake Shops</li>
                                <li>- Desserts</li>
                            </ul>
                            <a href="#" className="more-link">- More</a>
                        </div>
                    </div>

                    {/* Card 6: Foodie */}
                    <div className="category-card foodie">
                        {/* Image set directly using inline style */}
                        <div
                            className="card-image-wrapper"
                            style={{ backgroundImage: `url(${Foodie})` }}
                        ></div>
                        <div className="card-content">
                            <h3 className="card-title">Foodie</h3>
                            <ul className="category-list">
                                <li>- Coffee Shops</li> 
                                <li>- Shawarmas</li>
                                <li>- Sizzlers</li>
                            </ul>
                            <a href="#" className="more-link">- More</a>
                        </div>
                    </div>

                </div>

                <div className="view-all-wrapper">
                    <button className="view-all-btn">
                        View All Categories
                    </button>
                </div>
            </section>
        </div>
    );
};

export default RestuarantCards;