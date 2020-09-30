const { mxw, auth, utils } = require('mxw-sdk-js/dist/index');
const { sha256, toUtf8Bytes } = require('mxw-sdk-js/dist/utils')
const { sortObject } = require('mxw-sdk-js/dist/utils/misc');

class KycData {
    constructor(wallet) {
        this.wallet = wallet;
    }

    signKycAddress() {
        const kycDataPromise = async () =>
            auth.Kyc.create(this.wallet).then(async (kyc) => {
                console.log('STEP 1', 'Sign KYC address Started');
                let seed = sha256(toUtf8Bytes(JSON.stringify(sortObject({
                    juridical: ['', ''].sort(),
                    seed: utils.getHash(utils.randomBytes(32))
                }))));

                let kycAddress = kyc.getKycAddress({
                    country: 'MY',
                    idType: 'NIC',
                    id: this.wallet.address,
                    idExpiry: 20200101,
                    dob: 19800101,
                    seed
                });

                const data = await kyc.sign(kycAddress);
                console.log('STEP 2', 'Done!!!');

                return data;
            })

            return kycDataPromise();
    }

}
exports.KycData = KycData
