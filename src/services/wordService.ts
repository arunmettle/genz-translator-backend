import db from '../database';

export const saveWordMappings = async (wordMap: Record<string, string>) => {
  const existingWords = await getExistingEnglishWords(Object.keys(wordMap));

  const insertQuery = `
    INSERT INTO WordMappings (english, genz)
    VALUES ($1, $2)
    ON CONFLICT (english) DO NOTHING;
  `;

  for (const [english, genz] of Object.entries(wordMap)) {
    if (!existingWords.includes(english)) {
      await db.query(insertQuery, [english, genz]);
    }
  }
};

const getExistingEnglishWords = async (phrases: string[]): Promise<string[]> => {
  if (phrases.length === 0) return [];

  const placeholders = phrases.map((_, i) => `$${i + 1}`).join(', ');
  const result = await db.query(
    `SELECT english FROM WordMappings WHERE english IN (${placeholders})`,
    phrases
  );

  return result.rows.map((row) => row.english);
};
