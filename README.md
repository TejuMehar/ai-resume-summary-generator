# AI Resume Summary Generator

Generate professional resume summaries using AI (Google Gemini).

## Features
- Upload PDF resumes
- AI-powered summary generation
- Clean, modern UI with Tailwind CSS
- Copy to clipboard functionality

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` in backend folder:
```
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Multer, Google Gemini AI, PDF-Parse
