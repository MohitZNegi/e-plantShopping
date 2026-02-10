import React, { useState, useEffect } from "react";
// Redux Hooks:
// - useSelector: Hook to access/read data from Redux store's state
// - useDispatch: Hook to dispatch actions to Redux store
import { useSelector, useDispatch } from "react-redux";
// Import the actions (functions) created from CartSlice that will update the Redux state
import { removeItem, updateQuantity } from "./CartSlice";
import "./CartItem.css";

const CartItem = ({ onContinueShopping }) => {
  // useSelector: Subscribes to the Redux store and retrieves the cart items
  // It takes a selector function that extracts the data we need from the store
  // Changes to this state will automatically re-render the component
  const cart = useSelector((state) => state.cart.items);

  // useDispatch: Returns the dispatch function to trigger actions
  // Used to send actions to Redux store to update the state
  const dispatch = useDispatch();

  // Calculate total amount for all products in the cart
  // This function reads from Redux store (cartItems) and calculates the sum
  // It uses reduce() to accumulate total cost: quantity × cost for each item
  const calculateTotalAmount = () => {
    return cart
      .reduce(
        (total, item) =>
          total + parseFloat(item.cost.replace("$", "")) * item.quantity,
        0,
      )
      .toFixed(2);
  };

  const handleContinueShopping = (e) => {
    e.preventDefault();
    onContinueShopping();
  };

  const handleIncrement = (item) => {
    // DISPATCH ACTION: Trigger the updateQuantity action from CartSlice
    // dispatch() sends the action to Redux store, which calls the updateQuantity reducer
    // The reducer receives { itemName, quantity } in action.payload
    dispatch(
      updateQuantity({ itemName: item.name, quantity: item.quantity + 1 }),
    );
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      // DISPATCH ACTION: Decrease quantity by 1
      dispatch(
        updateQuantity({ itemName: item.name, quantity: item.quantity - 1 }),
      );
    } else {
      // If quantity is 1, remove the item from cart
      handleRemove(item);
    }
  };

  const handleRemove = (item) => {
    // DISPATCH ACTION: Trigger the removeItem action from CartSlice
    // The reducer receives item.name in action.payload and removes the item from the cart
    dispatch(removeItem(item.name));
  };

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {
    return (parseFloat(item.cost.replace("$", "")) * item.quantity).toFixed(2);
  };
  // UI state for in-page modal/toast
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCheckout = () => {
    const total = calculateTotalAmount();
    if (!cart || cart.length === 0) {
      setToastMessage("Your cart is empty. Add items before checking out.");
      setShowToast(true);
      return;
    }

    // Show in-page confirmation modal
    setShowConfirm(true);
  };

  const handleConfirmProceed = () => {
    const total = calculateTotalAmount();
    setShowConfirm(false);
    setToastMessage(
      `Thank you for your purchase! Your card will be charged $${total}.`,
    );
    setShowToast(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    setToastMessage("Checkout canceled.");
    setShowToast(true);
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (!showToast) return;
    const id = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(id);
  }, [showToast]);

  // Inline styles for modal and toast
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    maxWidth: "90%",
    width: "360px",
    textAlign: "center",
  };

  const toastStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#333",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "6px",
    zIndex: 1100,
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: "black" }}>
        Total Cart Amount: ${calculateTotalAmount()}
      </h2>
      <div>
        {/* Render cart items from Redux store */}
        {/* cart variable comes from useSelector and contains all items in the cart */}
        {/* When an item is added/removed/updated in Redux, this map automatically re-renders */}
        {cart.map((item) => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>
              <div className="cart-item-quantity">
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
                <span className="cart-item-quantity-value">
                  {item.quantity}
                </span>
                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                Total: ${calculateTotalCost(item)}
              </div>
              <button
                className="cart-item-delete"
                onClick={() => handleRemove(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{ marginTop: "20px", color: "black" }}
        className="total_cart_amount"
      ></div>
      <div className="continue_shopping_btn">
        <button
          className="get-started-button"
          onClick={(e) => handleContinueShopping(e)}
        >
          Continue Shopping
        </button>
        <br />
        <button className="get-started-button1" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={modalOverlayStyle} className="cart-modal-overlay">
          <div style={modalStyle} className="cart-modal">
            <h3>Confirm Checkout</h3>
            <p>Your order total is ${calculateTotalAmount()}.</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                className="get-started-button"
                onClick={handleConfirmProceed}
              >
                Proceed
              </button>
              <button
                className="get-started-button"
                style={{ backgroundColor: "#f04141" }}
                onClick={handleConfirmCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {showToast && (
        <div style={toastStyle} className="cart-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartItem;
