const { mxw, auth } = require('mxw-sdk-js/dist/index');

class KycWhitelistor {
    constructor(middleware, transaction) {
        this.middleware = middleware;
        this.transaction = transaction;
    }


    whitelist() {
        const whitelistReceiptPromise = async (signedTransaction) =>
            auth.Kyc.create(this.middleware).then(async (kyc) => {
                console.log('STEP 9', 'Whitelist Wallet Address');
                let receipt = await kyc.whitelist(signedTransaction);
                console.log('STEP 9', 'Done !!!');
                return receipt;

            });



        return whitelistReceiptPromise(this.transaction);

    }


}
exports.KycWhitelistor = KycWhitelistor