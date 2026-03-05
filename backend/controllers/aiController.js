const { callGroq } = require('../services/groqService')

const matchResume = async (req, res) => {
    try {
        const { resume, jobDescription } = req.body
        const prompt = `You are a hiring expert. Analyze this resume against the job description and research the company hiring trend and how they hire as well.

Resume: ${resume}
Job Description: ${jobDescription}

You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanation. The JSON must contain exactly these keys: matchScore (number 0-100), matchedKeywords (array of strings), missingKeywords (array of strings), suggestions (string).`

        const result = await callGroq(prompt)
        let parsed
        try {
            parsed = JSON.parse(result)
        } catch (parseError) {
            console.error('AI returned invalid JSON for matchResume:', parseError.message)
            return res.status(500).json({ message: 'AI returned invalid JSON' })
        }
        res.status(200).json(parsed)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'AI Error' })
    }
}

const coverLetter = async (req, res) => {
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
        console.error('Cover letter generation failed:', error.message)
        res.status(500).json({ message: 'AI Error' })
    }
}

const followUp = async (req, res) => {
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
        console.error('Follow-up email generation failed:', error.message)
        res.status(500).json({ message: 'AI Error' })
    }
}

const suggestions = async (req, res) => {
    try {
        const { resume } = req.body
        const prompt = `You are an expert resume reviewer and career coach.

Resume: ${resume}

Analyze this resume and provide specific, actionable improvement suggestions.
You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanation. The JSON must contain exactly these keys: overallScore (number 0-100), strengths (array of strings), improvements (array of objects with section, issue, suggestion), missingKeywords (array of strings), quickWins (array of strings).`

        const result = await callGroq(prompt)
        let parsed
        try {
            parsed = JSON.parse(result)
        } catch (parseError) {
            console.error('AI returned invalid JSON for suggestions:', parseError.message)
            return res.status(500).json({ message: 'AI returned invalid JSON' })
        }
        res.status(200).json(parsed)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'AI Error' })
    }
}

module.exports = { matchResume, coverLetter, followUp, suggestions }
