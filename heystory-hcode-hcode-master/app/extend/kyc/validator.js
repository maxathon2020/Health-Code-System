const { mxw, auth } = require('mxw-sdk-js/dist/index');
const { computeAddress, sha256, toUtf8Bytes } = require('mxw-sdk-js/dist/utils')

class KycValidator {
    constructor(transaction) {
        this.transaction = transaction;
    }


    isValidSignature() {
        const isValidSignaturePromise = async (providerIssuerSignedTrx) => {
            console.log('STEP 7', 'Verify Transaction Signature Started');

            let isValid = providerIssuerSignedTrx.signatures.every((signature) => {

                let payload = JSON.stringify(providerIssuerSignedTrx.payload);
                let address = computeAddress(signature.pub_key.value);
                return mxw.utils.verify(payload, signature.signature, address);
            });
            console.log('STEP 8', 'Done!!!');

            return isValid;

        }

        return isValidSignaturePromise(this.transaction);

    }
}
exports.KycValidator = KycValidator