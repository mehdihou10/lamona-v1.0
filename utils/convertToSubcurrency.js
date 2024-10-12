function convertToSubcurrency(amount){

    const factor = 100;

    return Math.round(amount * factor);

}

export default convertToSubcurrency;