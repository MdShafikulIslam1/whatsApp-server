"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/check-user', auth_controller_1.AuthController.checkUser);
router.post('/onboard-user', auth_controller_1.AuthController.onboardUser);
exports.AuthRouter = router;
