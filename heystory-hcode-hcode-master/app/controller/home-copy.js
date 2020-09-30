'use strict';

const { mxw, nonFungibleToken, utils } = require('mxw-sdk-js/dist/index');
const { checkFormat, checkString, checkNumber, allowNullOrEmpty, notAllowNullOrEmpty, isUndefinedOrNullOrEmpty, checkBoolean, checkBigNumber, toUtf8Bytes } = require("mxw-libs-utils")
const { nodeProvider } = require("../extend/kyc/node");
const {KycData} = require("../extend/kyc/data");
const {KycProvider} = require("../extend/kyc/provider");
const {KycIssuer} = require("../extend/kyc/issuer");
const {KycValidator} = require("../extend/kyc/validator");
const {KycWhitelistor} = require("../extend/kyc/whitelistor");
const util = require("../extend/util");
const Controller = require('egg').Controller;

const nfToken = nonFungibleToken
let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection;
let provider;
let issuer;
let middleware;

providerConnection = new mxw.providers.JsonRpcProvider(
  nodeProvider.connection,
  nodeProvider
)
.on("rpc", function (args) {
  if ("response" == args.action) {
    if (silentRpc) {
      console.log("request", JSON.stringify(args.request));
      console.log("response", JSON.stringify(args.response));
    }
  }
})
.on("responseLog", function (args) {
  if (silentRpc) {
    console.log(
      "responseLog",
      JSON.stringify({ info: args.info, response: args.response })
    );
  }
});
provider = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.provider).connect(
  providerConnection
);

// mxw1ngx32epz5v5gyunepkarfh4lt0g6mqr79aq3ex
issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(
  providerConnection
);

// mxw1mklypleqjhemrlt6z625rzqa0jl6namdmmqnx4
middleware = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.middleware).connect(
  providerConnection
);
const defaultOverrides = {
  logSignaturePayload: function (payload) {
      console.log("signaturePayload:", JSON.stringify(payload));
  },
  logSignedTransaction: function (signedTransaction) {
      console.log("signedTransaction:", signedTransaction);
  }
}
class HomeController extends Controller {
  async index () {
    const {
      ctx
    } = this;
    await ctx.render('index');
  }

  async creatUser () {
    let wallet = mxw.Wallet.createRandom().connect(providerConnection);
    /**
     * Sign KYC address
     */
    const kycData = await new KycData(wallet).signKycAddress();
    /**
     * Provider Sign KYC Data
     */
    const partialSignedTrx = await new KycProvider(
      provider,
      kycData
    ).signTransaction();
    /**
     *  Issuer Sign KYC Data
     */
    const allSignedTrx = await new KycIssuer(
      issuer,
      partialSignedTrx
    ).signTransaction();
    /**
     * Verify Transaction Signature
     */
    const isValidSignature = await new KycValidator(
      allSignedTrx
    ).isValidSignature();
    /**
     * Whitelist a Wallet Address
     */
    const whitelistReceipt = await new KycWhitelistor(
      middleware,
      allSignedTrx
    ).whitelist();
    await (isValidSignature && wallet.isWhitelisted())
    this.ctx.body = {
      code: 200,
      data: {
        address: wallet.address,
        publicKey: wallet.publicKey,
        publicKeyType: wallet.publicKeyType,
        hexAddress: wallet.hexAddress,
        privateKey: wallet.privateKey
      }
    }
  }
  async createNft () {
    const {ctx} = this
    // let privateKey = ctx.request.body.key;
    // let walletWithProvider = new mxw.Wallet(privateKey, providerConnection);
    // let networkProvider = mxw.getDefaultProvider("localnet")
    // console.log('createNft++++++++walletWithProvider.address')
    // console.log(walletWithProvider.address)
    // walletWithProvider.fromMnemonic(nodeProvider.kyc.issuer)
    // let networkProvider = mxw.getDefaultProvider(providerConnection);
    let wallet = mxw.Wallet.createRandom().connect(providerConnection);
    /**
     * Sign KYC address
     */
    const kycData = await new KycData(wallet).signKycAddress();
    /**
     * Provider Sign KYC Data
     */
    const partialSignedTrx = await new KycProvider(
      provider,
      kycData
    ).signTransaction();
    /**
     *  Issuer Sign KYC Data
     */
    const allSignedTrx = await new KycIssuer(
      issuer,
      partialSignedTrx
    ).signTransaction();
    /**
     * Verify Transaction Signature
     */
    const isValidSignature = await new KycValidator(
      allSignedTrx
    ).isValidSignature();
    /**
     * Whitelist a Wallet Address
     */
    const whitelistReceipt = await new KycWhitelistor(
      middleware,
      allSignedTrx
    ).whitelist();
    await (isValidSignature && wallet.isWhitelisted())

    const symbol = util.uuid()
    const nonFungibleTokenProperties = {
      "name": "COVID-19 Info",
      "symbol": symbol,
      "properties": "token properties",
      "metadata": ctx.request.body.data,
      "fee": {
        "to": "mxw1md4u2zxz2ne5vsf9t4uun7q2k0nc3ly5g22dne",
        "value": "10000000"
      }
    }
    console.log('symbol++++++++', symbol)
    await nonFungibleToken.NonFungibleToken.create(nonFungibleTokenProperties, issuer, defaultOverrides)
    await this.approveNft(symbol)
    this.ctx.body = {
      code: 200,
      data: symbol
    }
  }
  async approveNft(symbol) {
    let overrides = {
      tokenFees: [
          { action: nfToken.NonFungibleTokenActions.transfer, feeName: "default" },
          { action: nfToken.NonFungibleTokenActions.transferOwnership, feeName: "default" },
          { action: nfToken.NonFungibleTokenActions.acceptOwnership, feeName: "default" }
      ],
      mintLimit: 1000,
      transferLimit: 100,
      endorserListLimit: 1000,
      endorserList: [],
      burnable: true,
      transferable: true,
      modifiable: true,
      pub: false
    };
    return nfToken.NonFungibleToken.approveNonFungibleToken(symbol, provider, overrides).then((transaction) => {
      return nfToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer)
    }).then((transaction) => {
      console.log('transaction+++++')
      console.log('provider', provider)
      console.log('issuer', issuer)
      console.log('middleware', middleware)
      console.log('transaction---------')
      return nfToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware).then((receipt) => {
        if (overrides && overrides.notRefresh) {
          return receipt;
        }
        else {
          //TODO please do refresh
          return receipt;
        }
      })
  });
    // let transaction = await nfToken.NonFungibleToken.approveNonFungibleToken(symbol, provider, overrides)
    // console.log('transaction1++++++++', transaction)
    // transaction = await nfToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer)
    // console.log('transaction2++++++++', transaction)
    // console.log('transaction2----------------')
    // const receipt = await nfToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware);
    // console.log('receipt++++++++', receipt)
    // console.log('receipt----------------')
    // return receipt
  }
  async mintNftItem() {
    const {ctx} = this
    let privateKey = ctx.request.body.key;
    let walletWithProvider = new mxw.Wallet(privateKey, providerConnection);
    // let networkProvider = mxw.getDefaultProvider("localnet")
    console.log('walletWithProvider++++++++')
    console.log(walletWithProvider)

    const itemId = 'itemId' + util.uuid()
    const data = {
      metadata: ctx.request.body.data,
      properties: 'TestNonFungibleToken'
    }
    let vData = {
      nftSymbol: ctx.request.body.symbol,
      itemId
    }

    let nftToken = new NonFungibleToken(vData.nftSymbol, issuer)

    const itemProp = {
        symbol: vData.nftSymbol,
        itemID: vData.itemId,
        properties: data.properties,
        metadata: data.metadata
    }
    await nftToken.mint(issuer.address, itemProp)
    this.endorseNft(vData.nftSymbol, vData.itemId)
    this.ctx.body = {
      code: 200
    }
  }
  async endorseNft (nftSymbol, itemId) {
    let eData = {
      nftSymbol,
      itemId
    }
    let nftItem = new NonFungibleTokenItem(eData.nftSymbol, eData.itemId, issuer);
    await nftItem.endorse()
    return true
  }
  async signAndSendNftTransaction(symbol, callback, overrides) {
    return Promise.resolve().then(() => {
        return callback(symbol, this.provider, overrides)
            .then((transaction) => {
                // clog(levels.NORMAL, "@signAndSendNftTransaction Provider transaction:", JSON.stringify(transaction));
                return nfToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, this.issuer, overrides);
            }).then((transaction) => {
                // clog(levels.NORMAL, "@signAndSendNftTransaction Issuer transaction:", JSON.stringify(transaction));
                return nfToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, this.middleware, overrides);
            });
    });
  }
}
module.exports = HomeController;
