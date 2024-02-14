define(['../lib/crypto-js-3.1.9-1/crypto-js', '../CRM/DAO/IntegrationMappingDAO'], (CryptoJS, IntegrationMappingDAO) => {
    class EncryptUtils {
        constructor() {
            this.key = new IntegrationMappingDAO().findEncryptionKey()
        }

        encryptData(data, key = this.key) {
            return CryptoJS.AES.encrypt(data, key).toString()
        }

        decryptData(encryptedData, key = this.key) {
            const MD5HashedKey = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(key)).toString()
            const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(MD5HashedKey), { keySize: 32, mode: CryptoJS.mode.ECB })
            const decryptedWordArray = CryptoJS.lib.WordArray.create(decrypted.words, (decrypted.sigBytes));
            const decryptedBase64Text = CryptoJS.enc.Base64.stringify(decryptedWordArray);
            const decryptedUtf8Text = CryptoJS.enc.Base64.parse(decryptedBase64Text).toString(CryptoJS.enc.Utf8);

            return decryptedUtf8Text;
        }

        decryptTranId(tranId, key = this.key) {
            var decryptedUtf8Text = this.decryptData(tranId, key);
            const reversedValue = decryptedUtf8Text.split('').reverse().join('');

            const head = reversedValue.slice(8)
            const tail = reversedValue.slice(0, 8)
            return 'R99' + head + tail
        }
    }

    return EncryptUtils
})
