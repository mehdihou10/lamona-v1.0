import React from 'react'

const ProfileImage = ({name}) => {
  return (
    <span data-profile={true} className='uppercase select-none grid place-items-center bg-sky-200 text-gray-700 rounded-full w-[30px] h-[30px]'>
     {name.slice(0,1)}
    </span>
  )
}

export default ProfileImage
