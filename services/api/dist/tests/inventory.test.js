"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const app_1 = require("../src/app");
const seed_1 = require("@dukaanpilot/database/src/seed");
const auth_service_1 = require("../src/services/auth.service");
(0, node_test_1.describe)('Inventory & Stock Movement API Tests', () => {
    const app = (0, app_1.createApp)();
    let token = '';
    (0, node_test_1.before)(async () => {
        (0, seed_1.seedDatabase)('shp_demomart');
        const auth = await auth_service_1.AuthService.registerOwner({
            phone: '9988112233',
            name: 'Inventory Tester',
            password: 'password123',
            shopName: 'Stock Kirana',
        });
        token = auth.tokens.accessToken;
    });
    (0, node_test_1.it)('GET /api/v1/inventory/alerts should return low stock alerts', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/inventory/alerts`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.ok(body.data.totalAlerts >= 1);
            node_assert_1.default.ok(body.data.items.some((i) => i.name.includes('Atta') || i.name.includes('Oil')));
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('POST /api/v1/inventory/adjust should update stock and record audit movement', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            // Find a product
            const pRes = await fetch(`http://127.0.0.1:${port}/api/v1/products?limit=1`);
            const pBody = await pRes.json();
            const product = pBody.data.items[0];
            const initialStock = product.currentStock;
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/inventory/adjust`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    delta: 10,
                    type: 'PURCHASE_IN',
                    reason: 'Supplier Delivery Invoice #BANSAL-104',
                }),
            });
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.data.quantityBefore, initialStock);
            node_assert_1.default.strictEqual(body.data.currentStock, initialStock + 10);
            node_assert_1.default.strictEqual(body.data.movement.type, 'PURCHASE_IN');
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('GET /api/v1/inventory/movements should return stock movement audit trail', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/inventory/movements`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.ok(body.data.length > 0);
        }
        finally {
            server.close();
        }
    });
});
