# ApplyMate 🚀

An AI-powered job application tracker built with React, Node.js, Express, and PostgreSQL.

## Features

- 📊 Track all your job applications in one place
- 🤖 AI Resume Matcher — see how well your resume matches a job description
- ✉️ AI Cover Letter Generator — generate tailored cover letters instantly
- 📧 AI Follow-up Email Writer — never miss a follow-up
- 📈 Dashboard with live stats — Applied, Interviewing, Offers, Rejected
- 🔐 Secure JWT authentication

## Tech Stack

**Frontend:** React, React Router, Axios

**Backend:** Node.js, Express.js, PostgreSQL

**AI:** Groq API (Llama 3.3)

**Auth:** JWT, bcryptjs

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation

1. Clone the repo
   git clone https://github.com/jeelsojitra25/ApplyMate.git

2. Install backend dependencies
   cd appymate && npm install

3. Install frontend dependencies
   cd frontend && npm install

4. Set up environment variables in backend/.env
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=applymate
   DB_PASSWORD=yourpassword
   DB_PORT=5432
   GROQ_API_KEY=yourapikey
   JWT_SECRET=yoursecret

5. Run the database schema
   psql -U postgres -d applymate -f database/schema.sql

6. Start backend
   npm run dev

7. Start frontend
   cd frontend && npm start

## Screenshots

- <img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/bcc4fd2c-616e-4878-8b16-fff300ef2085" />

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/f8cae471-8efe-4ae8-a4cc-14aa6b639326" />

![Uploading image.png…]() 


## Author

Jeel Sojitra — [LinkedIn](https://linkedin.com/in/yourlinkedin) — jeelsojitra2512@gmail.com


