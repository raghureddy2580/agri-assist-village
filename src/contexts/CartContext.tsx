import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
    id: number;
    name: string;
    farmer: string;
    price: number;
    unit: string;
    image: string;
    category: string;
    quality: string;
    location: { city: string; area: string };
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
    | { type: 'CLEAR_CART' };

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
                return {
                    ...state,
                    items: updatedItems,
                    totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
            } else {
                const newItems = [...state.items, action.payload];
                return {
                    ...state,
                    items: newItems,
                    totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalAmount: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
            }
        }

        case 'REMOVE_FROM_CART': {
            const filteredItems = state.items.filter(item => item.id !== action.payload);
            return {
                ...state,
                items: filteredItems,
                totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            ).filter(item => item.quantity > 0);

            return {
                ...state,
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        }

        case 'CLEAR_CART':
            return {
                items: [],
                totalItems: 0,
                totalAmount: 0
            };

        default:
            return state;
    }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        totalItems: 0,
        totalAmount: 0
    });

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
