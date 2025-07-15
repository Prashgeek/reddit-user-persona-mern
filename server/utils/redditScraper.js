import axios from 'axios';

export const scrapeRedditUser = async (username) => {
  const commentsURL = `https://www.reddit.com/user/${username}/comments.json?limit=25`;
  const postsURL = `https://www.reddit.com/user/${username}/submitted.json?limit=25`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; RedditPersonaBot/1.0; +https://yourwebsite.com)',
    'Accept': 'application/json',
  };

  try {
    const [commentsRes, postsRes] = await Promise.all([
      axios.get(commentsURL, { headers, timeout: 10000 }),
      axios.get(postsURL, { headers, timeout: 10000 }),
    ]);

    const comments = commentsRes.data?.data?.children?.map(item => item.data) || [];
    const posts = postsRes.data?.data?.children?.map(item => item.data) || [];

    // 🛡️ Optional: Check if no content at all
    if (comments.length === 0 && posts.length === 0) {
      throw new Error(`No public Reddit activity found for user "${username}".`);
    }

    return { username, comments, posts };
  } catch (err) {
    console.error(`🔴 Failed to scrape Reddit user "${username}":`, err.response?.status || err.message);
    throw new Error('Failed to scrape Reddit user content. Make sure the username is valid and public.');
  }
};
