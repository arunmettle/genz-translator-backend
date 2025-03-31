"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
        "OpenAI-Project": process.env.OPENAI_PROJECT_ID,
    },
});
exports.default = openai;
