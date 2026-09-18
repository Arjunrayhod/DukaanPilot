/**
 * DukaanPilot - Shared Domain Types, Enums and DTOs
 */
export declare enum UserRole {
    OWNER = "OWNER",
    STAFF = "STAFF",
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN"
}
export declare enum ShopCategory {
    KIRANA_GROCERY = "KIRANA_GROCERY",
    GENERAL_STORE = "GENERAL_STORE",
    TAILOR = "TAILOR",
    REPAIR_ELECTRONICS = "REPAIR_ELECTRONICS",
    FRUITS_VEGETABLES = "FRUITS_VEGETABLES",
    DAIRY_SWEETS = "DAIRY_SWEETS",
    OTHER = "OTHER"
}
export declare enum MovementType {
    PURCHASE_IN = "PURCHASE_IN",
    SALE_OUT = "SALE_OUT",
    ADJUSTMENT = "ADJUSTMENT",
    RETURN = "RETURN",
    WASTAGE = "WASTAGE"
}
export interface UserDTO {
    id: string;
    phone: string;
    name: string;
    email?: string | null;
    role: UserRole;
    shopId?: string | null;
    createdAt: string;
}
export interface ShopDTO {
    id: string;
    name: string;
    ownerId: string;
    category: ShopCategory;
    phone: string;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    upiId?: string | null;
    gstNumber?: string | null;
    currency: string;
    isActive: boolean;
    createdAt: string;
}
export interface CategoryDTO {
    id: string;
    shopId: string;
    name: string;
    nameHindi?: string | null;
    icon?: string | null;
    displayOrder: number;
}
export interface ProductDTO {
    id: string;
    shopId: string;
    categoryId?: string | null;
    categoryName?: string | null;
    name: string;
    nameHindi?: string | null;
    barcode?: string | null;
    sku?: string | null;
    brand?: string | null;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    mrp: number;
    gstRate: number;
    currentStock: number;
    minThreshold: number;
    reorderQty: number;
    imageUrl?: string | null;
    supplierId?: string | null;
    supplierName?: string | null;
    isActive: boolean;
    createdAt: string;
}
export interface StockMovementDTO {
    id: string;
    shopId: string;
    productId: string;
    productName?: string;
    quantityBefore: number;
    deltaQuantity: number;
    quantityAfter: number;
    type: MovementType;
    referenceId?: string | null;
    reason?: string | null;
    userId?: string | null;
    createdAt: string;
}
export interface SupplierDTO {
    id: string;
    shopId: string;
    name: string;
    contactPerson?: string | null;
    phone: string;
    email?: string | null;
    address?: string | null;
    gstNumber?: string | null;
    paymentTerms?: string | null;
    isActive: boolean;
    createdAt: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}
export interface AuthResponse {
    user: UserDTO;
    shop?: ShopDTO | null;
    tokens: AuthTokens;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: string;
}
export interface HealthStatus {
    status: 'UP' | 'DOWN' | 'DEGRADED';
    version: string;
    timestamp: string;
    uptime: number;
    environment: string;
    database: {
        connected: boolean;
        provider: 'postgresql' | 'sqlite' | 'in-memory-fallback';
        latencyMs?: number;
    };
    storage: {
        budgetLimitGb: number;
        estimatedUsedMb: number;
    };
}
//# sourceMappingURL=index.d.ts.map