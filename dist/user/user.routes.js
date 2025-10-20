"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validator_1 = require("./user.validator");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = express_1.default.Router();
router.post('/signup', user_validator_1.userValidator, validate_middleware_1.validation, user_controller_1.signUp);
router.post('/login', user_controller_1.login);
exports.default = router;
//# sourceMappingURL=user.routes.js.map