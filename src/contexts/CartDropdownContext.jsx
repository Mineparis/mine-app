import { createContext, useContext, useState } from 'react';

const CartDropdownContext = createContext();

export const useCartDropdown = () => useContext(CartDropdownContext);

export const CartDropdownProvider = ({ children }) => {
	const [isCartOpen, setCartOpen] = useState(false);

	const toggleCart = (state) => setCartOpen(state);

	return (
		<CartDropdownContext.Provider value={{ isCartOpen, toggleCart }}>
			{children}
		</CartDropdownContext.Provider>
	);
};
