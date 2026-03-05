const Joi = require('joi')

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ message: error.details.map((d) => d.message).join(', ') })
    }
    next()
}

const schemas = {
    register: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    createApplication: Joi.object({
        company: Joi.string().min(1).max(200).required(),
        role: Joi.string().min(1).max(200).required(),
        status: Joi.string().valid('Applied', 'Interviewing', 'Offer', 'Rejected').required(),
        applied_date: Joi.date().iso().required(),
        follow_up_date: Joi.date().iso().allow('', null).optional(),
        job_url: Joi.string().uri().allow('', null).optional(),
        notes: Joi.string().max(2000).allow('', null).optional(),
    }),

    updateApplication: Joi.object({
        company: Joi.string().min(1).max(200).required(),
        role: Joi.string().min(1).max(200).required(),
        status: Joi.string().valid('Applied', 'Interviewing', 'Offer', 'Rejected').required(),
        follow_up_date: Joi.date().iso().allow('', null).optional(),
        job_url: Joi.string().uri().allow('', null).optional(),
        notes: Joi.string().max(2000).allow('', null).optional(),
    }),

    matchResume: Joi.object({
        resume: Joi.string().min(1).required(),
        jobDescription: Joi.string().min(1).required(),
    }),

    coverLetter: Joi.object({
        resume: Joi.string().min(1).required(),
        jobDescription: Joi.string().min(1).required(),
        company: Joi.string().min(1).max(200).required(),
        role: Joi.string().min(1).max(200).required(),
    }),

    followUp: Joi.object({
        company: Joi.string().min(1).max(200).required(),
        role: Joi.string().min(1).max(200).required(),
        daySinceApplied: Joi.number().integer().min(0).required(),
        notes: Joi.string().max(2000).allow('', null).optional(),
    }),

    suggestions: Joi.object({
        resume: Joi.string().min(1).required(),
    }),
}

module.exports = { validate, schemas }
