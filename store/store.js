import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/auth';
import cartSlice from './slices/cart';


export const store = configureStore({
    
    reducer: {
        isSigned: authSlice,
        cart: cartSlice
    }
})