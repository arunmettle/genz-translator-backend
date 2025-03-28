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
            store: true
        });
        let result = completion.choices[0].message?.content || '{}';
        console.log(result);
        result = result.replace(/```json|```/g, '').trim();
        const json = JSON.parse(result);
        const fullTranslation = json.fullTranslation || '';
        delete json.fullTranslation;
        // Save new mappings
        //const insert = db.prepare(`INSERT OR IGNORE INTO WordMappings (english, genz) VALUES (?, ?)`);
        //Object.entries(json).forEach(([english, genz]) => {
        //     insert.run(english, genz);
        //   });
        return res.json({ original: content, genz: fullTranslation, wordMap: json });
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
