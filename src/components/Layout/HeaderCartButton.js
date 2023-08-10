import { useContext, useEffect, useState } from 'react';

import CartIcon from '../Cart/CartIcon';
import CartContext from '../../store/cart-context';

import classes from './HeaderCartButton.module.css';

const HeaderCartButton = props => {

    const [buttonIsHighlighted, setButtonIsHighlighted] = useState(false);

    const cartContext = useContext(CartContext);

    // object destructuring to pull items out of cart context
    const { items } = cartContext;

    const numberOfCartItems = items.reduce((currentNumber, item) => {
        return currentNumber + item.amount;
    }, 0);

    const btnClasses = `${classes.button} ${buttonIsHighlighted ? classes.bump : ''}`;

    useEffect(() => {
        if (items.length === 0) {
            return;
        }

        setButtonIsHighlighted(true);

        // resetting is required to remove bump class from btnClasses list.
        // So that every time we see bump effect an item is added to cart
        const timer = setTimeout(() => {
            setButtonIsHighlighted(false);
        }, 300);

        // clean up function will be automatically called by react.
        // just add a return method at the end of useEffect
        return () => {
            clearTimeout(timer);
        };
    }, [items]);

    return (
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon />
            </span>
            <span>Cart</span>
            <span className={classes.badge}>
                {numberOfCartItems}
            </span>
        </button>
    );
};

export default HeaderCartButton;