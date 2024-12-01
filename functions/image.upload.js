import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


export const verifyFileType = (url)=>{

    const type = url.split('/')[0].split(':')[1];

    if(type === 'image'){

        return true;
    }

    return false;
}

export const verifyFileSize = (file)=>{

    const fileSizeInMB = file.size / (1024 * 1024);

    if(fileSizeInMB > 10){

        return false;
    }

    return true;
}

export const handleFileChange = (event,fun,data) => {
    const file = event.target.files[0];

    if (file) {

    if (!verifyFileSize(file)) {
      toast.error('File size must be less than 10MB');
      return;
    }

      const reader = new FileReader();
      reader.onload = () => {

        const res = reader.result;


        if(verifyFileType(res)){
          fun({...data,image: reader.result});

        } else{

          toast.error('File type must me image');
          return;
        }
      };
      reader.readAsDataURL(file);
    }
};