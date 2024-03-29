"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.get('/all-user', auth_controller_1.AuthController.getAllUser);
router.get('/:id', auth_controller_1.AuthController.getSingleUserById);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/create-account', auth_controller_1.AuthController.createAccount);
exports.AuthRouter = router;
