import { Request, Response } from "express";
import openai from "../services/openaiService";

export const translate = async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
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

    let result: string = completion.choices[0].message?.content || "{}";
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
  } catch (error: any) {
    if (error.response) {
      console.error(
        "OpenAI Error:",
        error.response.status,
        error.response.data
      );
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
};

export default translate;