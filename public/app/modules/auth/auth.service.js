"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpes_1 = require("../../../helpers/jwtHelpes");
const config_1 = __importDefault(require("../../../config"));
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
    });
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcrypt_1.default.compare(payload.password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { id, email } = isUserExist;
    const accessToken = jwtHelpes_1.JwtHelpers.createToken({ id, email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return accessToken;
});
const getSingleUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return isExistUser;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        orderBy: {
            name: 'asc',
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersGroupByInitialLetter = {};
    users === null || users === void 0 ? void 0 : users.forEach(user => {
        var _a;
        const initialLetter = (_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.charAt(0).toUpperCase();
        if (!usersGroupByInitialLetter[initialLetter]) {
            usersGroupByInitialLetter[initialLetter] = [];
        }
        usersGroupByInitialLetter[initialLetter].push(user);
    });
    return usersGroupByInitialLetter;
});
exports.AuthService = {
    createAccount,
    login,
    getAllUser,
    getSingleUserById,
};
