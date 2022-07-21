import CryptoES from "crypto-es";



const encryption = (id,text) => {
    const encrypted  = CryptoES.AES.encrypt(text,id).toString();
    console.log(encrypted);
    return encrypted
}

const decryption = (id,text) => {
    var C = require("crypto-js");
    var decrypted = C.AES.decrypt(text,id);
    var result = decrypted.toString(C.enc.Utf8);
    console.log(result);
    return result;
}

export {encryption,decryption};