"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
console.log("OPENAI_PROJECT_ID:", process.env.OPENAI_PROJECT_ID);
