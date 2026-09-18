"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const app_1 = require("../src/app");
(0, node_test_1.describe)('Authentication & Authorization Tests', () => {
    const app = (0, app_1.createApp)();
    const testUser = {
        phone: '9876543210',
        name: 'Ramesh Ganesh',
        password: 'securePassword123',
        shopName: 'Shree Ganesh Kirana Store',
        pin: '1234',
    };
    (0, node_test_1.it)('POST /api/v1/auth/register should register a new shop owner and return JWT', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testUser),
            });
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 201);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.strictEqual(body.data.user.phone, testUser.phone);
            node_assert_1.default.strictEqual(body.data.user.role, 'OWNER');
            node_assert_1.default.strictEqual(body.data.shop.name, testUser.shopName);
            node_assert_1.default.ok(body.data.tokens.accessToken);
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('POST /api/v1/auth/login should allow password authentication', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: testUser.phone,
                    password: testUser.password,
                }),
            });
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.strictEqual(body.data.user.name, testUser.name);
            node_assert_1.default.ok(body.data.tokens.accessToken);
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('POST /api/v1/auth/login should allow quick PIN authentication', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: testUser.phone,
                    pin: '1234',
                }),
            });
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.ok(body.data.tokens.accessToken);
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('GET /api/v1/auth/me should reject requests with no token', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/me`);
            node_assert_1.default.strictEqual(res.status, 401);
        }
        finally {
            server.close();
        }
    });
});
