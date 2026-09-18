"use strict";
/**
 * DukaanPilot - Shared Domain Types and Enums
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopCategory = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "OWNER";
    UserRole["STAFF"] = "STAFF";
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ShopCategory;
(function (ShopCategory) {
    ShopCategory["KIRANA_GROCERY"] = "KIRANA_GROCERY";
    ShopCategory["GENERAL_STORE"] = "GENERAL_STORE";
    ShopCategory["TAILOR"] = "TAILOR";
    ShopCategory["REPAIR_ELECTRONICS"] = "REPAIR_ELECTRONICS";
    ShopCategory["FRUITS_VEGETABLES"] = "FRUITS_VEGETABLES";
    ShopCategory["DAIRY_SWEETS"] = "DAIRY_SWEETS";
    ShopCategory["OTHER"] = "OTHER";
})(ShopCategory || (exports.ShopCategory = ShopCategory = {}));
//# sourceMappingURL=index.js.map