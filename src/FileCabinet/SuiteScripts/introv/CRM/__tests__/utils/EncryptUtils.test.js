const EncryptUtils = require('../../../utils/EncryptUtils')

describe('EncryptUtils', () => {
    let encryptUtils

    beforeEach(() => {
        encryptUtils = new EncryptUtils('123')
    })

    describe('encryptData', () => {
        it('should encrypt data using AES algorithm and UTF-8 encoding', () => {
            const encryptedData = encryptUtils.encryptData('Hello World')
            expect(encryptedData).toBeDefined()
            expect(typeof encryptedData).toBe('string')
        })
    })

    describe('decryptData', () => {
        it('should decrypt encrypted data using AES algorithm and UTF-8 encoding', () => {
            const encryptedData = encryptUtils.encryptData('Hello World')
            const decryptedData = encryptUtils.decryptData(encryptedData)
            expect(decryptedData).toBeDefined()
            expect(typeof decryptedData).toBe('string')
            expect(decryptedData).toBe('Hello World')
        })
    })

    describe('decryptTranId', () => {
        it('should decrypt and rearrange the transaction ID', () => {
            const encryptedTranId = encryptUtils.encryptData('1234567887654321')
            const decryptedTranId = encryptUtils.decryptTranId(encryptedTranId)
            expect(decryptedTranId).toBeDefined()
            expect(typeof decryptedTranId).toBe('string')
            expect(decryptedTranId).toBe('8765432112345678')
        })
    })
})
