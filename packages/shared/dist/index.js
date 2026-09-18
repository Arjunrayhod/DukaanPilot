"use strict";
/**
 * DukaanPilot - Shared Domain Types, Enums and DTOs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementType = exports.ShopCategory = exports.UserRole = void 0;
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
var MovementType;
(function (MovementType) {
    MovementType["PURCHASE_IN"] = "PURCHASE_IN";
    MovementType["SALE_OUT"] = "SALE_OUT";
    MovementType["ADJUSTMENT"] = "ADJUSTMENT";
    MovementType["RETURN"] = "RETURN";
    MovementType["WASTAGE"] = "WASTAGE";
})(MovementType || (exports.MovementType = MovementType = {}));
//# sourceMappingURL=index.js.map