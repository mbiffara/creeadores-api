"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const node_crypto_1 = require("node:crypto");
const hashPassword = (password) => {
    const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, node_crypto_1.scryptSync)(password, salt, 64).toString('hex');
    return `scrypt$${salt}$${hash}`;
};
exports.hashPassword = hashPassword;
const verifyPassword = (password, storedHash) => {
    const [method, salt, hash] = storedHash.split('$');
    if (method !== 'scrypt' || !salt || !hash) {
        return false;
    }
    const expected = Buffer.from(hash, 'hex');
    const derived = (0, node_crypto_1.scryptSync)(password, salt, expected.length);
    return (0, node_crypto_1.timingSafeEqual)(expected, derived);
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=password.js.map