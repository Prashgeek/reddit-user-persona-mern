import axios from 'axios';

export const scrapeRedditUser = async (username) => {
  const commentsURL = `https://www.reddit.com/user/${username}/comments.json`;
  const postsURL = `https://www.reddit.com/user/${username}/submitted.json`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
  };

  try {
    const [commentsRes, postsRes] = await Promise.all([
      axios.get(commentsURL, { headers }),
      axios.get(postsURL, { headers }),
    ]);

    const comments = commentsRes.data?.data?.children?.map(item => item.data) || [];
    const posts = postsRes.data?.data?.children?.map(item => item.data) || [];

    return { username, comments, posts };
  } catch (err) {
    console.error(`🔴 Failed to scrape Reddit user "${username}":`, err.message);
    throw new Error('Failed to scrape Reddit user content. Make sure the username is valid.');
  }
};
