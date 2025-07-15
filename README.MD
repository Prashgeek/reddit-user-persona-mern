# Reddit User Persona Extractor 

This is a MERN-stack web application that generates a detailed **user persona** based on a Reddit user's comments and posts.

##  Features

- ✅ Enter any Reddit user profile URL
- ✅ Scrapes public posts and comments
- ✅ Generates personality profile using AI (Gemini or fallback)
- ✅ Stores results in the server
- ✅ Clean UI for interaction

---

##  Tech Stack

- Frontend: React.js
- Backend: Express.js, Node.js
- Database: MongoDB
- AI Integration: Gemini API (Google's LLM)
- API fallback for offline/mock demo

---

##  Important Notice

This app uses **Gemini AI API** (Google) to generate the user persona.

- The free quota **has been exhausted** in this demo.
- To allow the app to continue functioning, a **mock (fake) persona generator** is used as a fallback.
- ✅ The real Gemini integration is implemented and can be tested by setting a working API key and enabling it in `.env`.

---

##  How to Run

1. **Clone this repo**
2. **Install dependencies**

```bash
cd server
npm install
cd ../client
npm install

## Create .env files

In /server/.env
env
Copy
Edit
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
USE_FAKE=true  # Set to false when you want to use real Gemini API


## Start the app

# From root directory
cd server && npm run dev
# In another terminal
cd client && npm start


Example Input
Reddit URL: https://www.reddit.com/user/Hungry-Move-6603/

Output (Mocked Example)
sql
Copy
Edit
The user appears interested in gaming from the post: "Finally beat Elden Ring!"  
They show a sarcastic tone in the comment: "Yeah, right, like that's ever gonna work."



