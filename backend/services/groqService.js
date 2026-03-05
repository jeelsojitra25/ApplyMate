const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const callGroq = async (prompt) => {
    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
    })
    return response.choices[0].message.content
}

module.exports = { callGroq }
