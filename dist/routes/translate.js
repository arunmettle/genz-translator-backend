"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
const openaiService_1 = __importDefault(require("../services/openaiService"));
const translate = async (req, res) => {
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

          1. Return a JSON object.
          2. Include key-value pairs mapping as many meaningful words or phrases as possible, even simple ones like "today" or "isn't it".
          3. Include a field "fullTranslation" with the final Gen Z sentence.
          4. Keep it short, relatable, and fun.

          Sentence:
          "${content}"`,
                },
            ],
            temperature: 0.8,
            max_completion_tokens: 200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            store: true,
        });
        let result = completion.choices[0].message?.content || "{}";
        console.log(result);
        result = result.replace(/```json|```/g, "").trim();
        const json = JSON.parse(result);
        const fullTranslation = json.fullTranslation || "";
        delete json.fullTranslation;
        return res.json({
            original: content,
            genz: fullTranslation,
            wordMap: json,
        });
    }
    catch (error) {
        if (error.response) {
            console.error("OpenAI Error:", error.response.status, error.response.data);
            return res
                .status(error.response.status)
                .json({ error: error.response.data });
        }
        console.error("Unexpected Error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
};
exports.translate = translate;
exports.default = exports.translate;
