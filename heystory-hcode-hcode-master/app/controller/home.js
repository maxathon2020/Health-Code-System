'use strict';

// const { mxw, nonFungibleToken, utils } = require('mxw-sdk-js/dist/index');
const { bigNumberify } = require("mxw-sdk-js/dist/utils")
// const { nodeProvider } = require("../extend/kyc/node");
// const {KycData} = require("../extend/kyc/data");
// const {KycProvider} = require("../extend/kyc/provider");
// const {KycIssuer} = require("../extend/kyc/issuer");
// const {KycValidator} = require("../extend/kyc/validator");
// const {KycWhitelistor} = require("../extend/kyc/whitelistor");
// const util = require("../extend/util");

// import * as crypto from "crypto"
const crypto = require("crypto")
const { nodeProvider } = require("../extend/nft/node");
const { mxw, nonFungibleToken, utils } = require('mxw-sdk-js/dist/index');
const { Creator } = require("../extend/nft/creator");
const { Util } = require("../extend/nft/util");
const { Approver } = require("../extend/nft/approver");
const { Minter } = require("../extend/nft/minter");
const { Transferer } = require("../extend/nft/transferer");
const {KycData} = require("../extend/kyc/data");
const {KycProvider} = require("../extend/kyc/provider");
const {KycIssuer} = require("../extend/kyc/issuer");
const {KycValidator} = require("../extend/kyc/validator");
const {KycWhitelistor} = require("../extend/kyc/whitelistor");
const {NonFungibleTokenItem} = require("mxw-sdk-js/dist/non-fungible-token-item");
const Controller = require('egg').Controller;

const { NonFungibleToken } = require("../extend/nft/token");

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection
let provider
let issuer
let middleware
let feeCollector
let wallet
let token
let issuerNonFungibleToken

/**
  * initialization
  */
 providerConnection = new mxw.providers.JsonRpcProvider(
  nodeProvider.connection,
  nodeProvider
)
  .on('rpc', function (args) {
    if ('response' == args.action) {
      if (silentRpc) {
        console.log('request', JSON.stringify(args.request));
        console.log('response', JSON.stringify(args.response));
      }
    }
  })
  .on('responseLog', function (args) {
    if (silentRpc) {
      console.log('responseLog', JSON.stringify({ info: args.info, response: args.response }))
    }
  });

class HomeController extends Controller {
  async index () {
    const { ctx } = this;
    await ctx.render('index');
  }

  async creatUser () {
    provider = mxw.Wallet.fromMnemonic(nodeProvider.kyc.provider).connect(providerConnection);

    issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(providerConnection);

    middleware = mxw.Wallet.fromMnemonic(nodeProvider.kyc.middleware).connect(providerConnection);
    
    let wallet = mxw.Wallet.createRandom().connect(providerConnection);
    console.log('wallet.mnemonic')
    console.log(wallet.mnemonic)
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
        mnemonic: wallet.mnemonic,
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
    // let wallet = new mxw.Wallet(privateKey, providerConnection).connect(providerConnection);
    // console.log('wallet', wallet.address)
    provider = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.provider).connect(providerConnection);

    issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(providerConnection);

    middleware = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.middleware).connect(providerConnection);

    feeCollector =  nodeProvider.nonFungibleToken.feeCollector
    wallet = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(providerConnection)
    
    const nftProperties = new NonFungibleToken().nonFungibleTokenProperties;
    const symbol =  nftProperties.symbol;
    console.log('ctx.request.body.data')
    console.log(ctx.request.body.data)
    const creator = new Creator({...nftProperties, ...{metadata: ctx.request.body.data}}, issuer, wallet);
    issuerNonFungibleToken = await creator.create();
    token = await Util.reload(symbol, wallet);
    issuerNonFungibleToken = await Util.reload(symbol, issuer);
    
    const receipt = await new Approver(symbol, provider, issuer, middleware).approve();
    token = await Util.reload(symbol, wallet);
    issuerNonFungibleToken = await Util.reload(symbol, issuer);
    
    const itemId = crypto.randomBytes(16).toString('hex');
    const minter = new Minter(symbol, itemId, 'minter metadata');
    const trxReceipt = await minter.mint(wallet, issuer.address);
    
    this.ctx.body = {
      code: 200,
      data: {symbol, itemId}
    }
  }
  async queryNft () {
    const {ctx} = this
    issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(providerConnection);
    let symbol = ctx.request.body.symbol;
    await mxw.nonFungibleToken.NonFungibleToken.fromSymbol(symbol, issuer).then((token)=>{
      this.ctx.body = {
        code: 200,
        data: token['_state']['metadata']
      }
    })
  }
  async queryNftItem () {
    const {ctx} = this
    issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(providerConnection);
    const symbol = 'NFT7e87633c' // ctx.request.body.symbol;
    const itemId = '762eb5321f213a75f60d96e4474fe26b'
    const nftItem = await NonFungibleTokenItem.fromSymbol(symbol, itemId, issuer)
    const state = await nftItem.getState()
    console.log(1111)
    console.log(state)
    console.log(2222)
    this.ctx.body = {
      code: 200,
      // data: token['_state']['metadata']
    }
  }
  async approveNft(symbol) {
  //   let overrides = {
  //     tokenFees: [
  //         { action: nfToken.NonFungibleTokenActions.transfer, feeName: "default" },
  //         { action: nfToken.NonFungibleTokenActions.transferOwnership, feeName: "default" },
  //         { action: nfToken.NonFungibleTokenActions.acceptOwnership, feeName: "default" }
  //     ],
  //     mintLimit: 1000,
  //     transferLimit: 100,
  //     endorserListLimit: 1000,
  //     endorserList: [],
  //     burnable: true,
  //     transferable: true,
  //     modifiable: true,
  //     pub: false
  //   };
  //   return nfToken.NonFungibleToken.approveNonFungibleToken(symbol, provider, overrides).then((transaction) => {
  //     return nfToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer)
  //   }).then((transaction) => {
  //     console.log('transaction+++++')
  //     console.log('provider', provider)
  //     console.log('issuer', issuer)
  //     console.log('middleware', middleware)
  //     console.log('transaction---------')
  //     return nfToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware).then((receipt) => {
  //       if (overrides && overrides.notRefresh) {
  //         return receipt;
  //       }
  //       else {
  //         //TODO please do refresh
  //         return receipt;
  //       }
  //     })
  // });
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
  async updateNft () {
    const symbol = 'NFT7e87633c'
    let wallet = new mxw.Wallet('0x1d00c7ef3e6a41599a24bb504be0b323479102696c6df93a4c9d2d6077296f6a', providerConnection)
    issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(providerConnection);
    // let nonFungibleTokenProperties= {
    //   name: "MY" + symbol,
    //   symbol: symbol,
    //   fee: {
    //       to: nodeProvider.nonFungibleToken.feeCollector,
    //       value: bigNumberify("1")
    //   },
    //   metadata: '{"name":"唐增祥","tel":"22222","id":"1121212121","sex":"1","birthday":"44444","address":"55555","health":["2"],"contactHistory":"1","ensure":["1"]}',
    //   properties: "properties"
    // };
    let nftInstance = new nfToken.NonFungibleToken(symbol, issuer)
    console.log(nftInstance)
    //overwrite the token metadata with string "overwrite"
    await nftInstance.updateMetadata("teetetete")
    this.ctx.body = {
      code: 200,
      // data: token['_state']['metadata']
    }
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
  async endorseNft () {
    const {ctx} = this
    const symbol = ctx.request.body.symbol;
    const itemId = ctx.request.body.itemId;
    // let privateKey = ctx.request.body.key;
    // let wallet = new mxw.Wallet(privateKey, providerConnection);
    // console.log('wallet', wallet.address)

    issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(providerConnection);
    const metadata = {
      viewer: ctx.request.body.viewer,
      date: ctx.request.body.date
    }
    let nftItem = new NonFungibleTokenItem(symbol, itemId, issuer);
    await nftItem.endorse(JSON.stringify(metadata))
    this.ctx.body = {
      code: 200
    }
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
