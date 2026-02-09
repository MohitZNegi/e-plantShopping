import React from "react";
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
        <button className="get-started-button1">Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;
