"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
        'OpenAI-Project': process.env.OPENAI_PROJECT_ID,
    },
});
app.post('/translate', async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: `Translate this English sentence to Gen Z slang. Keep it fun, relatable, and short. Only return the Gen Z version with no explanation.\n\n"${content}"`,
                },
            ],
            response_format: {
                "type": "text"
            },
            temperature: 0.8,
            max_completion_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            store: true
        });
        const translated = completion.choices[0]?.message?.content?.trim();
        res.json({ original: content, genz: translated });
    }
    catch (error) {
        if (error.response) {
            console.error('OpenAI Error:', error.response.status, error.response.data);
            return res.status(error.response.status).json({ error: error.response.data });
        }
        console.error('Unexpected Error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
