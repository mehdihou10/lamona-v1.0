import React from 'react'
import Link from 'next/link'
import { SiInternetcomputer } from "react-icons/si";


const Logo = ({logoStyle}) => {
  return (
    <Link href="/" className={`flex items-center gap-[10px] font-rubik text-main ${logoStyle}`}>

        <SiInternetcomputer />
        Lamona
      
    </Link>
  )
}

export default Logo
