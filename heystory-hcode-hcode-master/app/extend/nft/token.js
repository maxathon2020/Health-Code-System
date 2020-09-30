"use strict";
exports.__esModule = true;
var utils_1 = require("mxw-sdk-js/dist/utils");
var node_1 = require("./node");
var NonFungibleToken = /** @class */ (function () {
    function NonFungibleToken() {
        var symbol = "NFT" + utils_1.hexlify(utils_1.randomBytes(4)).substring(2);
        this._nonFungibleTokenProperties = {
            name: "MY" + symbol,
            symbol: symbol,
            fee: {
                to: node_1.nodeProvider.nonFungibleToken.feeCollector,
                value: utils_1.bigNumberify("1")
            },
            metadata: "metadata",
            properties: "properties"
        };
    }
    Object.defineProperty(NonFungibleToken.prototype, "nonFungibleTokenProperties", {
        get: function () {
            return this._nonFungibleTokenProperties;
        },
        set: function (value) {
            this._nonFungibleTokenProperties = value;
        },
        enumerable: false,
        configurable: true
    });
    return NonFungibleToken;
}());
exports["NonFungibleToken"] = NonFungibleToken;
