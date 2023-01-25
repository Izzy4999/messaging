import CryptoJs from "crypto-js";

const encrypt = (toEncrypt: string) => {
  const encrypted = CryptoJs.AES.encrypt(
    toEncrypt,
    "secret key 123"
  ).toString();

  return encrypted;
};

export default encrypt;
