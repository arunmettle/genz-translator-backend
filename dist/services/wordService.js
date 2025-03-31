"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWordMappings = void 0;
const database_1 = __importDefault(require("../database"));
const saveWordMappings = async (wordMap) => {
    const existingWords = await getExistingEnglishWords(Object.keys(wordMap));
    const insertQuery = `
    INSERT INTO WordMappings (english, genz)
    VALUES ($1, $2)
    ON CONFLICT (english) DO NOTHING;
  `;
    for (const [english, genz] of Object.entries(wordMap)) {
        if (!existingWords.includes(english)) {
            await database_1.default.query(insertQuery, [english, genz]);
        }
    }
};
exports.saveWordMappings = saveWordMappings;
const getExistingEnglishWords = async (phrases) => {
    if (phrases.length === 0)
        return [];
    const placeholders = phrases.map((_, i) => `$${i + 1}`).join(', ');
    const result = await database_1.default.query(`SELECT english FROM WordMappings WHERE english IN (${placeholders})`, phrases);
    return result.rows.map((row) => row.english);
};
