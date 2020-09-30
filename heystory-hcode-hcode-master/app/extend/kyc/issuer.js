const { mxw, auth } = require('mxw-sdk-js/dist/index');

class KycIssuer {
    constructor(issuer, transaction) {
        this.issuer = issuer;
        this.transaction = transaction;
    }

    signTransaction() {

        const issuerSignedTrxPromise = async (providerSignedTransaction) =>
            auth.Kyc.create(this.issuer).then(async (kyc) => {
                console.log('STEP 5', 'Issuer Sign KYC Data Started');

                let transaction = await kyc.signTransaction(providerSignedTransaction);
                console.log('STEP 6', 'Done!!!');

                return transaction;
            });

        return issuerSignedTrxPromise(this.transaction);
    }
}
exports.KycIssuer = KycIssuer