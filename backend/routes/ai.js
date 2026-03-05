const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const auth = require('../middleware/auth')
const { matchResume, coverLetter, followUp, suggestions } = require('../controllers/aiController')
const { validate, schemas } = require('../middleware/validate')

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: 'Too many AI requests, please try again later.' },
})

router.post('/match', aiLimiter, auth, validate(schemas.matchResume), matchResume)
router.post('/cover-letter', aiLimiter, auth, validate(schemas.coverLetter), coverLetter)
router.post('/follow-up', aiLimiter, auth, validate(schemas.followUp), followUp)
router.post('/suggestions', aiLimiter, auth, validate(schemas.suggestions), suggestions)

module.exports = router
