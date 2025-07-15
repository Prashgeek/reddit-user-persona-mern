import axios from 'axios';

export const scrapeRedditUser = async (rawUsername) => {
  // ✅ Clean up username (handle trailing slashes)
  const username = rawUsername.replace(/^\/+|\/+$/g, '').replace('user/', '');

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

    if (comments.length === 0 && posts.length === 0) {
      throw new Error(`No public Reddit activity found for user "${username}".`);
    }

    return { username, comments, posts };
  } catch (err) {
    const status = err.response?.status;
    const errorMsg = status
      ? `Reddit API error (status: ${status}) for user "${username}"`
      : err.message;

    console.error(`🔴 Scraping failed: ${errorMsg}`);
    throw new Error('Failed to scrape Reddit user content. Make sure the username is valid and public.');
  }
};
