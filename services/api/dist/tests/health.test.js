"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const app_1 = require("../src/app");
(0, node_test_1.describe)('Health Endpoints Integration Tests', () => {
    const app = (0, app_1.createApp)();
    (0, node_test_1.it)('GET / should return online status', async () => {
        // Start local ephemeral listener for test
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.name, 'DukaanPilot API');
            node_assert_1.default.strictEqual(body.status, 'ONLINE');
        }
        finally {
            server.close();
        }
    });
    (0, node_test_1.it)('GET /api/v1/health should return system status UP and storage metrics', async () => {
        const server = app.listen(0);
        const port = server.address().port;
        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
            const body = await res.json();
            node_assert_1.default.strictEqual(res.status, 200);
            node_assert_1.default.strictEqual(body.success, true);
            node_assert_1.default.strictEqual(body.data.status, 'UP');
            node_assert_1.default.strictEqual(body.data.storage.budgetLimitGb, 15);
        }
        finally {
            server.close();
        }
    });
});
