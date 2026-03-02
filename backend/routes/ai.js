require('dotenv').config({ path: __dirname + '/../.env' })
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Groq = require('groq-sdk')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const callGroq = async (prompt) => {
    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
    })
    return response.choices[0].message.content
}

router.post('/match', auth, async (req, res) => {
    try {
        const { resume, jobDescription } = req.body
        const prompt = `You are a hiring expert. Analyze this resume against the job description and research the company hiring trend and how they hire as well.

Resume: ${resume}
Job Description: ${jobDescription}

Respond in this exact JSON format:
{
  "matchScore": 75,
  "matchedKeywords": ["JavaScript", "React", "Node.js"],
  "missingKeywords": ["Docker", "AWS"],
  "suggestions": "Add more backend experience"
}
Return only valid JSON, no extra text.`

        const result = await callGroq(prompt)
        const parsed = JSON.parse(result)
        res.status(200).json(parsed)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'AI Error' })
    }
})

router.post('/cover-letter', auth, async (req, res) => {
    try {
        const { resume, jobDescription, company, role } = req.body
        const prompt = `Write a professional cover letter for this candidate applying to ${role} at ${company}.

Resume: ${resume}
Company: ${company}
Job Description: ${jobDescription}
Role: ${role}

Write a compelling 3 paragraph cover letter. Be specific and professional and make it sound like a human, not AI.`

        const result = await callGroq(prompt)
        res.status(200).json({ coverLetter: result })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'AI Error' })
    }
})

router.post('/follow-up', auth, async (req, res) => {
    try {
        const { company, role, daySinceApplied, notes } = req.body
        const prompt = `Write a professional follow-up email for a job application.

Company: ${company}
Role: ${role}
Days Since Applied: ${daySinceApplied}
Notes: ${notes}

Write a short, professional follow-up email. Max 3 paragraphs.`

        const result = await callGroq(prompt)
        res.status(200).json({ email: result })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'AI Error' })
    }
})

router.post('/suggestions', auth, async (req, res) => {
    try {
        const { resume } = req.body
        const prompt = `You are an expert resume reviewer and career coach.

Resume: ${resume}

Analyze this resume and provide specific, actionable improvement suggestions.
Respond in this exact JSON format:
{
  "overallScore": 78,
  "strengths": ["Strong technical skills section", "Quantified achievements"],
  "improvements": [
    { "section": "Summary", "issue": "Too generic", "suggestion": "Add specific industry focus and key value proposition" },
    { "section": "Experience", "issue": "Missing quantified results", "suggestion": "Add metrics like increased performance by 40%" }
  ],
  "missingKeywords": ["leadership", "agile", "cross-functional"],
  "quickWins": ["Add LinkedIn profile URL", "Include a skills summary at the top"]
}
Return only valid JSON, no extra text.`

        const result = await callGroq(prompt)
        const parsed = JSON.parse(result)
        res.status(200).json(parsed)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'AI Error' })
    }
})

module.exports = router
