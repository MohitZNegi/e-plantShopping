import React, { useState, useEffect } from "react";
import "./ProductList.css";
import CartItem from "./CartItem";
import plants from "./plants";
// Redux Hooks:
// - useDispatch: Hook to dispatch actions and modify Redux store state
// - useSelector: Hook to read/access data from Redux store
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// Import the addItem action created from CartSlice
import { addItem } from "./CartSlice";

function ProductList({ onHomeClick }) {
  const [showCart, setShowCart] = useState(false);
  const [showPlants, setShowPlants] = useState(false); // State to control the visibility of the About Us page
  const [addedToCart, setAddedToCart] = useState({}); // Local state to track which products are added to the cart

  // useDispatch: Get dispatch function to send actions to Redux store
  const dispatch = useDispatch();

  // useSelector: Subscribe to Redux store and get cart items
  // When cart items change, this component will automatically re-render
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total number of items in cart (sum of all quantities)
  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if a specific item is already in the cart by name
  const isItemInCart = (plantName) => {
    return cartItems.some((item) => item.name === plantName);
  };
  const styleObj = {
    backgroundColor: "#4CAF50",
    color: "#fff!important",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignIems: "center",
    fontSize: "20px",
  };
  const styleObjUl = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "1100px",
  };
  const styleA = {
    color: "white",
    fontSize: "30px",
    textDecoration: "none",
  };

  const handleaddToCart = (plant) => {
    // DISPATCH ACTION: Trigger the addItem action from CartSlice reducer
    // dispatch() sends the plant object as action.payload to the addItem reducer
    // The reducer checks if plant exists in cart, if yes increment quantity, else add it
    dispatch(addItem(plant));
  };

  // useEffect Hook: Synchronize local state with Redux store state
  // This runs whenever cartItems changes (dependency array)
  // Updates addedToCart to track current items in cart
  useEffect(() => {
    const newAddedToCart = {};
    // Loop through all items in Redux cart and mark them as added
    cartItems.forEach((item) => {
      newAddedToCart[item.name] = true;
    });
    // Update local state to reflect current Redux store state
    setAddedToCart(newAddedToCart);
  }, [cartItems]); // Dependency: Re-run this effect when cartItems changes

  const handleHomeClick = (e) => {
    e.preventDefault();
    onHomeClick();
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setShowCart(true); // Set showCart to true when cart icon is clicked
  };
  const handlePlantsClick = (e) => {
    e.preventDefault();
    setShowPlants(true); // Set showAboutUs to true when "About Us" link is clicked
    setShowCart(false); // Hide the cart when navigating to About Us
  };

  const handleContinueShopping = () => {
    setShowCart(false);
  };
  return (
    <div>
      <div className="navbar" style={styleObj}>
        <div className="tag">
          <div className="luxury">
            <img
              src="https://cdn.pixabay.com/photo/2020/08/05/13/12/eco-5465432_1280.png"
              alt=""
            />
            <a href="/" onClick={(e) => handleHomeClick(e)}>
              <div>
                <h3 style={{ color: "white" }}>Paradise Nursery</h3>
                <i style={{ color: "white" }}>Where Green Meets Serenity</i>
              </div>
            </a>
          </div>
        </div>
        <div style={styleObjUl}>
          <div>
            {" "}
            <a href="#" onClick={(e) => handlePlantsClick(e)} style={styleA}>
              Plants
            </a>
          </div>
          <div>
            {" "}
            <a href="#" onClick={(e) => handleCartClick(e)} style={styleA}>
              <h1 className="cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  id="IconChangeColor"
                  height="68"
                  width="68"
                >
                  <rect width="156" height="156" fill="none"></rect>
                  <circle cx="80" cy="216" r="12"></circle>
                  <circle cx="184" cy="216" r="12"></circle>
                  <path
                    d="M42.3,72H221.7l-26.4,92.4A15.9,15.9,0,0,1,179.9,176H84.1a15.9,15.9,0,0,1-15.4-11.6L32.5,37.8A8,8,0,0,0,24.8,32H8"
                    fill="none"
                    stroke="#faf9f9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    id="mainIconPathAttribute"
                  ></path>
                </svg>
                {/* Cart Count Badge - Displays total items in cart from Redux store */}
                {/* getTotalCartItems() reads cartItems from Redux and sums all quantities */}
                {/* Badge updates automatically whenever cartItems state changes in Redux */}
                {getTotalCartItems() > 0 && (
                  <span className="cart-count">{getTotalCartItems()}</span>
                )}
              </h1>
            </a>
          </div>
        </div>
      </div>
      {!showCart ? (
        <div className="product-grid">
          {plants.map((category) => (
            <div key={category.category} className="category-section">
              {/* Category Heading */}
              <h2 className="category-title">{category.category}</h2>

              {/* Plants inside each category */}
              <div className="plants-grid">
                {category.plants.map((plant) => (
                  <div
                    key={`${category.category}-${plant.name}`}
                    className="plant-card"
                  >
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="plant-image"
                    />

                    <h3 className="plant-name">{plant.name}</h3>
                    <p className="plant-description">{plant.description}</p>
                    <p className="plant-price">{plant.cost}</p>

                    {/* Add to Cart Button - State managed via Redux */}
                    {/* disabled: Uses isItemInCart() which checks Redux store to see if item already exists */}
                    {/* onClick: Dispatches addItem action to Redux when clicked */}
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleaddToCart(plant)}
                      disabled={isItemInCart(plant.name)}
                    >
                      {isItemInCart(plant.name)
                        ? "Added to Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CartItem onContinueShopping={handleContinueShopping} />
      )}
    </div>
  );
}

export default ProductList;
