require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./utils/errorHandler')
const authRoutes = require('./routes/auth')
const applicationRoutes = require('./routes/applications')
const aiRoutes = require('./routes/ai')

const app = express()

app.use(helmet())
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3001',
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Applymate API is running!' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
