"use client";

import {useEffect} from 'react'
import {useDispatch} from 'react-redux';
import { verifyAuth } from '@/store/slices/auth';


const DefaultSettings = ({children}) => {

    const dispatch = useDispatch();

    useEffect(()=>{

        dispatch(verifyAuth());

        // setTimeout(()=>window.location.reload(),3000);

    },[])


  return (
    <div>
      {children}
    </div>
  )
}

export default DefaultSettings
