"use client";

import {Oval} from 'react-loader-spinner';

const Loader = () => {
  return (
    <div>

  <Oval
  visible={true}
  height="22"
  width="22"
  color="white"
  ariaLabel="oval-loading"
  />
      
    </div>
  )
}

export default Loader
