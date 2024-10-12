import {createSlice} from '@reduxjs/toolkit';
import { isCookieExists } from '@/functions/cookie';


const authSlice = createSlice({

    name: "authSlice",
    initialState: null,
    reducers: {

        verifyAuth: (state,action)=>{

            return isCookieExists();
        }
    }
})

export const {verifyAuth} = authSlice.actions;
export default authSlice.reducer;