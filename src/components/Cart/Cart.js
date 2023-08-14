import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';

import classes from './Cart.module.css';
import Checkout from './Checkout';

const Cart = props => {

    const [isCheckout, setIsCheckout] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const cartContext = useContext(CartContext);

    const totalAmount = `₹${cartContext.totalAmount.toFixed(2)}`;

    const hasItems = cartContext.items.length > 0;

    const cartItemRemoveHandler = id => {
        cartContext.removeItem(id);
    };

    const cartItemAddHandler = item => {
        // we are doing cartContext.addItem({...item, amount: 1}); instead of
        // cartContext.addItem(item); because double clicking + in Cart doubles the number of items
        // Hence to mitigate that we use below approach
        cartContext.addItem({ ...item, amount: 1 });
    };

    const orderHandler = () => {
        setIsCheckout(true);
    };

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);

        const response = await fetch('https://react-http-10ee1-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderItems: cartContext.items
            })
        });

        setIsSubmitting(false);
        setIsSubmitted(true);

        cartContext.clearCart();
    };

    const cartItems =
        <ul className={classes['cart-items']}>
            {
                cartContext.items.map(item => (
                    <CartItem
                        key={item.id}
                        name={item.name}
                        amount={item.amount}
                        price={item.price}
                        onRemove={cartItemRemoveHandler.bind(null, item.id)}
                        onAdd={cartItemAddHandler.bind(null, item)}
                    />
                ))
            }
        </ul>;

    const modalActions = isCheckout
        ? <Checkout
            onCancel={props.onClose}
            onOrderConfirm={submitOrderHandler}
        />
        : (
            <div className={classes.actions}>
                <button
                    className={classes['button--alt']}
                    onClick={props.onClose}
                >
                    Close
                </button>
                {
                    hasItems
                    &&
                    <button
                        className={classes.button}
                        onClick={orderHandler}
                    >
                        Order
                    </button>
                }
            </div>
        );

    const cartModalContent = (
        <>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {modalActions}
        </>
    );

    const isSubmittingModalContent = <p>Sending over data....</p>;

    const isSubmittedModalContent = (
        <>
            <p>Successfully sent the order!</p>
            <div className={classes.actions}>
                <button
                    className={classes.button}
                    onClick={props.onClose}
                >
                    Close
                </button>
            </div>
        </>
    );

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !isSubmitted && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && isSubmitted && isSubmittedModalContent}
        </Modal>
    );
};

export default Cart;