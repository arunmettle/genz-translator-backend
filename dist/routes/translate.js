"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openaiService_1 = __importDefault(require("../services/openaiService"));
const wordService_1 = require("../services/wordService");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    try {
        const completion = await openaiService_1.default.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `You're a Gen Z slang expert. Convert the following English sentence into Gen Z language.
          
          1. Return only a valid JSON object. Do not include any explanation or introductory text.
          2. The JSON object should include:
             - "fullTranslation": The entire Gen Z sentence.
             - Key-value pairs mapping individual words or phrases to their Gen Z equivalents.
          3. Do not provide any additional text or explanations. Only return a valid JSON object.

          Sentence:
          "${content}"`,
                },
            ],
            temperature: 0.8,
            max_tokens: 200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        let result = completion.choices[0].message?.content || "";
        console.log("Raw GPT Response:", result);
        // Extract the JSON part from the response
        const jsonMatch = result.match(/(\{.*\})/s); // Improved regex pattern
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from GPT response");
        }
        const jsonString = jsonMatch[0].trim();
        try {
            const jsonObject = JSON.parse(jsonString); // Safely parse the extracted JSON block
            console.log("Parsed JSON Object:", jsonObject);
            const fullTranslation = jsonObject.fullTranslation || "";
            delete jsonObject.fullTranslation;
            await (0, wordService_1.saveWordMappings)(jsonObject);
            return res.json({
                original: content,
                genz: fullTranslation,
                wordMap: jsonObject,
            });
        }
        catch (parseError) {
            console.error("JSON Parsing Error:", parseError.message);
            throw new Error("Extracted string is not valid JSON.");
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Translation failed" });
    }
});
exports.default = router;
