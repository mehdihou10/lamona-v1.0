import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({

    name: "CartSlice",
    initialState: 0,
    reducers: {

        changeCart: (state,action)=>{

            return action.payload;

        },

        increaseCart: (state,action)=>{
            return ++state;
        },

        decreaseCart: (state,action)=>{

            return --state;
        }
    }
})

export const {changeCart,increaseCart,decreaseCart} = cartSlice.actions;
export default cartSlice.reducer;