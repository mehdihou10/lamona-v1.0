import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/auth';
import cartSlice from './slices/cart';
import wishlistSlice from './slices/wishlist';


export const store = configureStore({
    
    reducer: {
        isSigned: authSlice,
        cart: cartSlice,
        wishlist: wishlistSlice
    }
})