import {createSlice} from '@reduxjs/toolkit';

const wishlistSlice = createSlice({

    name: "wishlistSlice",
    initialState: 0,
    reducers: {

        changeWishlist: (state,action)=>{

            return action.payload;
        },

        increaseWishlist: (state,action)=>{

            return ++state
        },

        decreaseWishlist: (state,action)=>{

            return --state
        }
    }

})

export const {changeWishlist,increaseWishlist,decreaseWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;