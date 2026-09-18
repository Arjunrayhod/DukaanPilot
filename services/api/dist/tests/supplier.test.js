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
(0, node_test_1.describe)('Supplier & Restock Management API Tests', () => {
    const app = (0, app_1.createApp)();
    let token = '';
    (0, node_test_1.before)(async () => {
        (0, seed_1.seedDatabase)('shp_demomart');
        const auth = await auth_service_1.AuthService.registerOwner({
            phone: '9988223344',
            name: 'Supplier Tester',
            password: 'password123',
            shopName: 'Supplier Kirana',
        });
        token = auth.tokens.accessToken;
    });
    (0, node_test_1.it)('GET /api/v1/suppliers should list registered distributors', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/suppliers`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.ok(body.data.length >= 5);
            node_assert_1.default.ok(body.data.some((s) => s.name.includes('Bansal Wholesale Mart')));
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('POST /api/v1/suppliers should register a new distributor', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/suppliers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: 'Ganesh Dairy & Sweets Supply',
                    contactPerson: 'Mukesh Sharma',
                    phone: '+91 98990 11223',
                    paymentTerms: 'Weekly',
                }),
            });
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 201);
            node_assert_1.default.strictEqual(body.data.name, 'Ganesh Dairy & Sweets Supply');
        }
        finally {
            server.close();
        }
    });
});
