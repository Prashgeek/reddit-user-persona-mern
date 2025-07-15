import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const generateUserPersona = async ({ username, posts, comments }) => {
  const limitedPosts = posts.slice(0, 10);
  const limitedComments = comments.slice(0, 15);

  const combinedText =
    limitedPosts.map(p => `${p.title || ''} ${p.selftext || ''}`).join("\n") +
    limitedComments.map(c => c.body || '').join("\n");

  const prompt = `
You are an expert social psychologist. Based on the following Reddit content from the user "${username}", generate a comprehensive user persona.

Include:
- Interests
- Personality traits
- Communication style
- Tone and attitude
- Any patterns or behavioral cues

Cite each point using matching post or comment like:
- "Appears introverted from the comment: '...'”
- "Enjoys tech through post: '...'”

Here is the content:
${combinedText.slice(0, 8000)}
  `.trim();

  // ✅ MOCK MODE
  if (process.env.MOCK_AI === 'true') {
    console.log("⚙️ MOCK MODE ACTIVE — returning fake persona.");

    return {
      output: `
User "${username}" appears interested in tech, games, and pop culture.

- Shows interest in gaming via: "${limitedPosts[0]?.title || 'example post'}"
- Communicates in a humorous tone: "${limitedComments[0]?.body || 'example comment'}"
- Expresses critical thinking in multiple replies.

[This persona is mocked for testing without Gemini API.]
      `.trim(),
      citations: "Mocked based on first few scraped items.",
    };
  }

  // ✅ REAL GEMINI MODE
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      throw new Error("No content returned from Gemini API.");
    }

    return {
      output,
      citations: "Citations based on user’s Reddit posts/comments.",
    };
  } catch (err) {
    console.error("🔴 Gemini API Error:", err.response?.data || err.message);
    throw new Error("Failed to generate persona using Gemini.");
  }
};
