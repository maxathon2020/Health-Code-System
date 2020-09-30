"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var mxw_libs_utils_1 = require("mxw-libs-utils");
var mxw_sdk_js_1 = require("mxw-sdk-js");
var mxw_libs_clogger_1 = require("mxw-libs-clogger");
var non_fungible_token_1 = require("mxw-sdk-js/dist/non-fungible-token");
var non_fungible_token_item_1 = require("mxw-sdk-js/dist/non-fungible-token-item");
var NftService = /** @class */ (function () {
    function NftService() {
        this.defaultOverrides = {
            logSignaturePayload: function (payload) {
                console.log("signaturePayload:", JSON.stringify(payload));
            },
            logSignedTransaction: function (signedTransaction) {
                console.log("signedTransaction:", signedTransaction);
            }
        };
    }
    Object.defineProperty(NftService, "Instance", {
        /**
         * create singleton instance
         */
        get: function () {
            return this.self || (this.self = new this());
        },
        enumerable: false,
        configurable: true
    });
    NftService.prototype.init = function () {
        var _this = this;
        this.config = mxw_libs_utils_1.checkFormat({
            blockchainUrl: mxw_libs_utils_1.checkString,
            bcConnTimeout: mxw_libs_utils_1.allowNullOrEmpty(mxw_libs_utils_1.checkNumber, 20000),
            blockchainId: mxw_libs_utils_1.checkString,
            providerEncJson: mxw_libs_utils_1.checkString,
            issuerEncJson: mxw_libs_utils_1.checkString,
            middlewareEncJson: mxw_libs_utils_1.checkString
        }, {
            blockchainUrl: process.env.BLOCKCHAIN_URL,
            bcConnTimeout: process.env.BC_CONN_TIMEOUT,
            blockchainId: process.env.BLOCKCHAIN_ID,
            providerEncJson: process.env.PROVIDER_ENC_JSON,
            issuerEncJson: process.env.ISSUER_ENC_JSON,
            middlewareEncJson: process.env.MIDDLEWARE_ENC_JSON
        });
        // Blockchain RPC endpoint for middleware, API endpoint for issuer
        this.connection = {
            url: this.config.blockchainUrl,
            timeout: this.config.bcConnTimeout
        };
        this.providerConn = new mxw_sdk_js_1.mxw.providers.JsonRpcProvider(this.connection, {
            chainId: this.config.blockchainId,
            name: this.config.blockchainId
        });
        return mxw_sdk_js_1.mxw.Wallet.fromEncryptedJson(process.env.PROVIDER_ENC_JSON, process.env.JSON_ENC_PASSWORD)
            .then(function (providerWallet) {
            _this.provider = providerWallet.connect(_this.providerConn);
        }).then(function () {
            return mxw_sdk_js_1.mxw.Wallet.fromEncryptedJson(process.env.ISSUER_ENC_JSON, process.env.JSON_ENC_PASSWORD)
                .then(function (issuerWallet) {
                _this.issuer = issuerWallet.connect(_this.providerConn);
            });
        }).then(function () {
            return mxw_sdk_js_1.mxw.Wallet.fromEncryptedJson(process.env.MIDDLEWARE_ENC_JSON, process.env.JSON_ENC_PASSWORD)
                .then(function (middlewareWallet) {
                _this.middleware = middlewareWallet.connect(_this.providerConn);
            });
        });
    };
    NftService.prototype.createNft = function (data) {
        var _this = this;
        return Promise.resolve().then(function () {
            var nonFungibleTokenProperties = mxw_libs_utils_1.checkFormat({
                name: mxw_libs_utils_1.checkString,
                symbol: mxw_libs_utils_1.checkString,
                fee: mxw_libs_utils_1.notAllowNullOrEmpty(function (value) {
                    return mxw_libs_utils_1.checkFormat({
                        to: mxw_libs_utils_1.checkString,
                        value: mxw_libs_utils_1.checkBigNumber
                    }, value);
                }),
                metadata: mxw_libs_utils_1.checkString,
                properties: mxw_libs_utils_1.checkString
            }, __assign(__assign({}, data), { fee: {
                    to: "mxw1md4u2zxz2ne5vsf9t4uun7q2k0nc3ly5g22dne",
                    value: mxw_sdk_js_1.mxw.utils.bigNumberify("1")
                } }));
            // create NFT using above properties
            return mxw_sdk_js_1.nonFungibleToken.NonFungibleToken.create(nonFungibleTokenProperties, _this.issuer, _this.defaultOverrides)
                .then(function (token) {
                mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, JSON.stringify(token));
                return token;
            });
        });
    };
    NftService.prototype.approveNft = function (data) {
        var _this = this;
        return Promise.resolve().then(function () {
            var vData = mxw_libs_utils_1.checkFormat({
                symbol: mxw_libs_utils_1.checkString,
                mintLimit: mxw_libs_utils_1.checkNumber,
                transferLimit: mxw_libs_utils_1.checkNumber,
                burnable: mxw_libs_utils_1.checkBoolean,
                transferable: mxw_libs_utils_1.checkBoolean,
                modifiable: mxw_libs_utils_1.checkBoolean,
                pub: mxw_libs_utils_1.checkBoolean
            }, data);
            var overrides = {
                tokenFees: [
                    { action: mxw_sdk_js_1.nonFungibleToken.NonFungibleTokenActions.transfer, feeName: "default" },
                    { action: mxw_sdk_js_1.nonFungibleToken.NonFungibleTokenActions.transferOwnership, feeName: "default" },
                    { action: mxw_sdk_js_1.nonFungibleToken.NonFungibleTokenActions.acceptOwnership, feeName: "default" }
                ],
                mintLimit: vData.mintLimit,
                transferLimit: vData.transferLimit,
                burnable: vData.burnable,
                transferable: vData.transferable,
                modifiable: vData.modifiable,
                pub: vData.pub
            };
            return _this.signAndSendNftTransaction(vData.symbol, mxw_sdk_js_1.nonFungibleToken.NonFungibleToken.approveNonFungibleToken, overrides)
                .then(function (receipt) {
                mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "@approveNft receipt: " + JSON.stringify(receipt));
                return receipt;
            });
        });
    };
    NftService.prototype.mintNftItem = function (data) {
        var _this = this;
        return Promise.resolve().then(function () {
            var vData = mxw_libs_utils_1.checkFormat({
                nftSymbol: mxw_libs_utils_1.checkString,
                itemId: mxw_libs_utils_1.checkString
            }, data);
            var nftToken = new non_fungible_token_1.NonFungibleToken(vData.nftSymbol, _this.issuer);
            if (!String(vData.itemId).startsWith("0x")) {
                vData.itemId = mxw_sdk_js_1.utils.sha256(mxw_libs_utils_1.toUtf8Bytes(vData.itemId));
            }
            var itemProp = {
                symbol: vData.nftSymbol,
                itemID: vData.itemId,
                properties: JSON.stringify(data.properties),
                metadata: JSON.stringify(data.metadata)
            };
            mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "itemProp:", JSON.stringify(itemProp));
            return nftToken.mint(_this.provider.address, itemProp)
                .then(function (response) {
                mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "Mint response:", JSON.stringify(response));
                return response;
            });
        });
    };
    NftService.prototype.queryNftItem = function (data) {
        var _this = this;
        return Promise.resolve().then(function () {
            var vData = mxw_libs_utils_1.checkFormat({
                nftSymbol: mxw_libs_utils_1.checkString,
                itemId: mxw_libs_utils_1.allowNullOrEmpty(mxw_libs_utils_1.checkString)
            }, data);
            if (!String(vData.itemId).startsWith("0x")) {
                vData.itemId = mxw_sdk_js_1.utils.sha256(mxw_libs_utils_1.toUtf8Bytes(vData.itemId));
            }
            return non_fungible_token_item_1.NonFungibleTokenItem.fromSymbol(vData.nftSymbol, vData.itemId, _this.issuer)
                .then(function (nftItem) {
                return nftItem.getState().then(function (state) {
                    mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "state:", JSON.stringify(state));
                    return state;
                });
            });
        });
    };
    NftService.prototype.endorseNft = function (data) {
        var _this = this;
        return Promise.resolve().then(function () {
            var eData = mxw_libs_utils_1.checkFormat({
                nftSymbol: mxw_libs_utils_1.checkString,
                bizRegNo: mxw_libs_utils_1.allowNullOrEmpty(mxw_libs_utils_1.checkString),
                itemId: mxw_libs_utils_1.allowNullOrEmpty(mxw_libs_utils_1.checkString)
            }, data);
            if (!String(eData.itemId).startsWith("0x")) {
                eData.itemId = mxw_sdk_js_1.utils.sha256(mxw_libs_utils_1.toUtf8Bytes(eData.itemId));
            }
            var nftItem = new non_fungible_token_item_1.NonFungibleTokenItem(eData.nftSymbol, eData.itemId, _this.issuer);
            return nftItem.endorse(JSON.stringify(data.metadata), data.memo)
                .then(function (receipt) {
                mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "endorse receipt:", JSON.stringify(receipt));
                return receipt;
            });
        });
    };
    NftService.prototype.signAndSendNftTransaction = function (symbol, callback, overrides) {
        var _this = this;
        return Promise.resolve().then(function () {
            return callback(symbol, _this.provider, overrides)
                .then(function (transaction) {
                mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "@signAndSendNftTransaction Provider transaction:", JSON.stringify(transaction));
                return mxw_sdk_js_1.nonFungibleToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, _this.issuer, overrides);
            }).then(function (transaction) {
                mxw_libs_clogger_1.clog(mxw_libs_clogger_1.levels.NORMAL, "@signAndSendNftTransaction Issuer transaction:", JSON.stringify(transaction));
                return mxw_sdk_js_1.nonFungibleToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, _this.middleware, overrides);
            });
        });
    };
    return NftService;
}());
exports["default"] = NftService;
