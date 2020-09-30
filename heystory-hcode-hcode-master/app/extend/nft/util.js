"use strict";
exports.__esModule = true;
var index_1 = require("mxw-sdk-js/dist/index");
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.reload = function (symbol, wallet) {
        return index_1.nonFungibleToken.NonFungibleToken.fromSymbol(symbol, wallet);
    };
    Util.performNonFungibleTokenStatus = function (symbol, perform, provider, issuer, middleware, overrides) {
        return perform(symbol, provider, overrides).then(function (transaction) {
            return index_1.nonFungibleToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer);
        }).then(function (transaction) {
            return index_1.nonFungibleToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware).then(function (receipt) {
                if (overrides && overrides.notRefresh) {
                    return receipt;
                }
                else {
                    //TODO please do refresh
                    return receipt;
                }
            });
        });
    };
    Util.performNonFungibleTokenItemStatus = function (symbol, itemID, perform, provider, issuer, middleware, overrides) {
        return perform(symbol, itemID, provider, overrides).then(function (transaction) {
            return index_1.nonFungibleToken.NonFungibleToken.signNonFungibleTokenItemStatusTransaction(transaction, issuer);
        }).then(function (transaction) {
            return index_1.nonFungibleToken.NonFungibleToken.sendNonFungibleTokenItemStatusTransaction(transaction, middleware).then(function (receipt) {
                if (overrides && overrides.notRefresh) {
                    return receipt;
                }
                else {
                    //TODO please do refresh
                    return receipt;
                }
            });
        });
    };
    return Util;
}());
exports["Util"] = Util;
