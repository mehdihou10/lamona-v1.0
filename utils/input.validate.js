import validator from 'validator';



function verifyUserSignup(body){

    const {username,email,password,phoneNumber} = body;

    const errors = [];

    //username
    if(!validator.isLength(username,{min: 3, max: 30})){

        errors.push("Username must be from 2-30 Letters");

    } else if(!validator.isAlphanumeric(username)){

        errors.push('Username Have to be just Letters and Digits');
    }

    //email
    if(validator.isEmpty(email)){

        errors.push("Your Email is Empty");

    } else if(!validator.isEmail(email)){

        errors.push('Invalid Email Syntax');
    }

    //password
    if(validator.isEmpty(password)){

        errors.push("Your Password is Empty");

    } else if(!validator.isStrongPassword(password)){

        errors.push("Your Password is Weak");

    }

    //phone number
    if(validator.isEmpty(phoneNumber)){

        errors.push("Your Phone Number is Empty");

    } else if(!validator.isMobilePhone(phoneNumber)){

        errors.push("Invalid Phone Number Syntax");
    }


    return errors;

}

function verifyUserLogin(email,password){

    const errors = [];

    //email
    if(validator.isEmpty(email)){

        errors.push("Your Email is Empty");

    } else if(!validator.isEmail(email)){

        errors.push("Wrong Email Syntax");
    }

    //password
    if(validator.isEmpty(password)){

        errors.push("Your Password is Empty");

    }

    return errors;
}

function verifyEmail(email){

    let error = "";

    if(validator.isEmpty(email)){

        error = "Your Email is Empty";

    } else if(!validator.isEmail(email)){
        
        error = "Invalid Email Syntax";
    }

    return error;
}

function verifyPassword(password){

    let error = "";

    if(validator.isEmpty(password)){

        error = "Your Password is Empty";

    } else if(!validator.isStrongPassword(password)){

        error = "Your Password is Weak";
    }

    return error;
}

function verifyCheckoutData(body){

    const {address,email,phoneNumber} = body;

    const errors = [];

    //address
    if(validator.isEmpty(address)){

        errors.push("Your Address Is Empty");

    } 

    //email
    if(validator.isEmpty(email)){

        errors.push('Your Email is Empty');

    } else if(!validator.isEmail(email)){

        errors.push("Invalid Email Syntax");
    }

    //phone number
    if(validator.isEmpty(phoneNumber)){

        errors.push("Your Phone Number is Empty");

    } else if(!validator.isMobilePhone(phoneNumber)){

        errors.push("Invalid Phone Number Syntax");
    }

    return errors;


}

function verifyProductData(body){

    const errors = [];

    let {name,image,price,description,stock} = body;

    price = price.toString();
    stock = stock.toString();


    //name
    if(validator.isEmpty(name)){

        errors.push("Please Add Product Name")

    } else if(!validator.isAlphanumeric(name)){

        errors.push("Name must be just Letters & Numbers")
    }

    //image
    if(validator.isEmpty(image)){

        errors.push("Please Upload Product's Image")
    }

    //price
    if(validator.isEmpty(price)){

        errors.push("Please Add The Price")

    } else if(!validator.isNumeric(price)){

        errors.push("Price must be Numeric")

    } else if(+price <= 0){

        errors.push("Price must be Up to 0")
    }

    //description
    if(validator.isEmpty(description)){

        errors.push("Please Add a Description")

    } else if(!validator.isLength(description,{min: 50, max: 5000})){

        errors.push("Description must be in range of 50 to 5000")
    }

    //stock
    if(validator.isEmpty(stock)){

        errors.push("Please Add Product's Stock")

    } else if(!validator.isNumeric(stock)){

        errors.push("Stock must be Numeric")

    } else if(+stock < 0){

        errors.push("Stock can't be Negative")
    }


    return errors;
}

function verifySearchText(text){

    let error = "";

    if(!validator.isAlphanumeric(text)){

        error = "Please Type just Letters and Numbers";
    }

    return error;
}


export {
    verifyUserSignup,
    verifyUserLogin,
    verifyEmail,
    verifyPassword,
    verifyCheckoutData,
    verifyProductData,
    verifySearchText
}