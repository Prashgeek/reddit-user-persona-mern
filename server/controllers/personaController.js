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

  const startTime = Date.now(); // ⏱ Start timing

  try {
    if (!redditUrl || !redditUrl.includes('/user/')) {
      throw new Error('Invalid Reddit profile URL.');
    }

    const rawUsername = redditUrl.split('/user/')[1]?.split('/')[0]; // 🧹 More robust
    if (!rawUsername) {
      throw new Error('Reddit username could not be extracted.');
    }

    // Step 1: Scrape Reddit data
    const data = await scrapeRedditUser(rawUsername);

    if ((!data.posts || data.posts.length === 0) && (!data.comments || data.comments.length === 0)) {
      throw new Error('No Reddit activity found for this user.');
    }

    // Step 2: Generate persona
    const persona = await generateUserPersona({
      username: data.username,
      posts: data.posts,
      comments: data.comments,
    });

    // Step 3: Save result to /personas
    const dirPath = path.join(__dirname, '../personas');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${data.username}_persona.txt`);
    fs.writeFileSync(filePath, persona.output);

    const endTime = Date.now();
    const secondsTaken = ((endTime - startTime) / 1000).toFixed(2); // ⏱ Calculate total time

    res.json({
      persona: persona.output,
      citations: persona.citations,
      estimatedTime: `${secondsTaken} seconds`, // ⏱ Include time taken
    });
  } catch (err) {
    console.error('🔴 Backend Error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
