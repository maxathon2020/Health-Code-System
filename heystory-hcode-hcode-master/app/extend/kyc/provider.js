const { mxw, auth } = require('mxw-sdk-js/dist/index');

class KycProvider {
    constructor(provider, kycData,) {
        this.provider = provider;
        this.kycData = kycData;
    }

    signTransaction() {

        const providerSignedTrxPromise = async (kycData) =>
            auth.Kyc.create(this.provider).then(async (kyc) => {
                console.log('STEP 3', 'Provider Sign KYC Data Started');

                let nonSignedTransaction = {
                    payload: kycData,
                    signatures: []
                };
                let transaction = await kyc.signTransaction(nonSignedTransaction);
                console.log('STEP 4', 'Done!!!');
                return transaction;
            });

        return providerSignedTrxPromise(this.kycData);
    }
}
exports.KycProvider = KycProvider