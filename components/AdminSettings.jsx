"use client";
import {useState,useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { userTypes } from '@/utils/user.types';
import { httpStatus } from '@/utils/https.status';
import {PageLoading} from '@/components';


const AdminSettings = ({children}) => {

    const router = useRouter();
    const [cookies,setCookie] = useCookies(['lamona-user']);

    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(()=>{

        if(!cookies['lamona-user']){

            router.push('/');

        } else{

            verifyUser();
        }

        

    },[])

    const verifyUser = async()=>{

        try{

            const res = await fetch('/api/decrypt',{
                method: "GET",
                headers: {
                    'ath': `Bearer ${cookies['lamona-user']}`
                }
            })

            const data = await res.json();

            if(res.ok){

                const user = data.user;

                if(user.type === userTypes.ADMIN){

                    setIsAdmin(true)

                } else{
                    router.push('/')
                }
                
            } else{

                alert(httpStatus.SERVER_ERROR_MESSAGE)
            }

        } catch(err){

            console.log(err)
        }
    }


  return (
    <>
    
    {isAdmin ? children : <PageLoading />}
    </>
  )
}

export default AdminSettings
