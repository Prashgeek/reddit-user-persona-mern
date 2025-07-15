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
    if (!redditUrl || !redditUrl.includes('/user/')) {
      throw new Error('Invalid Reddit profile URL.');
    }

    const username = redditUrl.split('/user/')[1]?.replace('/', '');
    if (!username) {
      throw new Error('Reddit username could not be extracted.');
    }

    const data = await scrapeRedditUser(username);

    // ✅ Correct check: must have either posts or comments
    if ((!data.posts || data.posts.length === 0) && (!data.comments || data.comments.length === 0)) {
      throw new Error('No Reddit activity found for this user.');
    }

    const persona = await generateUserPersona({
      username: data.username,
      posts: data.posts,
      comments: data.comments,
    });

    // 🔧 Create /personas folder if it doesn’t exist
    const dirPath = path.join(__dirname, '../personas');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${username}_persona.txt`);
    fs.writeFileSync(filePath, persona.output);

    res.json({ persona: persona.output, citations: persona.citations });
  } catch (err) {
    console.error('🔴 Backend Error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
