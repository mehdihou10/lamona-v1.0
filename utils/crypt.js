import cryptoJs from "crypto-js"

const encryptData = (obj)=>{

    const crypted = cryptoJs.AES.encrypt(JSON.stringify(obj),process.env.CRYPTO_KEY).toString();

    return crypted;

}

const decryptData = (str)=>{

    const bytes = cryptoJs.AES.decrypt(str,process.env.CRYPTO_KEY);

    const decrypted = bytes.toString(cryptoJs.enc.Utf8);

    return JSON.parse(decrypted);
}

export {encryptData,decryptData}