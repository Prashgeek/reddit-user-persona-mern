import { scrapeRedditUser } from '../utils/redditScraper.js';
import { generateUserPersona } from '../utils/openaiHelper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePersona = async (req, res) => {
  const { redditUrl } = req.body;

  try {
    if (!redditUrl.includes('/user/')) throw new Error('Invalid Reddit profile URL');

    const username = redditUrl.split('/user/')[1]?.replace('/', '');
    if (!username) throw new Error('Reddit username could not be extracted');

    const data = await scrapeRedditUser(username);
    if (!data || data.length === 0) throw new Error('No Reddit activity found.');

    const persona = await generateUserPersona(data);

    // 🔧 Use correct absolute path to /personas folder
    const dirPath = path.join(__dirname, '../personas');
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${username}_persona.txt`);
    fs.writeFileSync(filePath, persona.output);

    res.json({ persona: persona.output, citations: persona.citations });
  } catch (err) {
    console.error("🔴 Backend Error:", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
