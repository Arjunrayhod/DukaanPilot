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
(0, node_test_1.describe)('Product & Catalog API Tests', () => {
    const app = (0, app_1.createApp)();
    let token = '';
    (0, node_test_1.before)(async () => {
        (0, seed_1.seedDatabase)('shp_demomart');
        const auth = await auth_service_1.AuthService.registerOwner({
            phone: '9988776655',
            name: 'Tester Shopkeeper',
            password: 'password123',
            shopName: 'Test Kirana',
        });
        token = auth.tokens.accessToken;
    });
    (0, node_test_1.it)('GET /api/v1/products should return seeded catalog with 90+ items', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/products?limit=100`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.ok(body.data.total >= 50);
            node_assert_1.default.ok(body.data.items.length >= 50);
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('GET /api/v1/products?search=Atta should filter products by name or Hindi translation', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/products?search=Atta`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.ok(body.data.items.length > 0);
            node_assert_1.default.ok(body.data.items.some((i) => i.name.includes('Atta')));
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('GET /api/v1/products/barcode/8901030381011 should lookup Aashirvaad Atta 10kg', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/products/barcode/8901030381011`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.data.barcode, '8901030381011');
            node_assert_1.default.strictEqual(body.data.sellingPrice, 420);
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('POST /api/v1/products should create a new product when authenticated', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: 'Haldiram Soan Papdi 500g',
                    nameHindi: '???????? ??? ??????',
                    sellingPrice: 160,
                    costPrice: 125,
                    currentStock: 15,
                    minThreshold: 4,
                    unit: 'box',
                    barcode: '8904004499999',
                }),
            });
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 201);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.strictEqual(body.data.name, 'Haldiram Soan Papdi 500g');
            node_assert_1.default.strictEqual(body.data.currentStock, 15);
        }
        finally {
            server.close();
        }
    });
});
