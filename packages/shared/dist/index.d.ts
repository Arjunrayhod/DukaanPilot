/**
 * DukaanPilot - Shared Domain Types and Enums
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
        provider: 'postgresql' | 'sqlite';
        latencyMs?: number;
    };
    storage: {
        budgetLimitGb: number;
        estimatedUsedMb: number;
    };
}
//# sourceMappingURL=index.d.ts.map