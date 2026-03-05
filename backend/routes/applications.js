const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getAll, getStats, create, update, remove } = require('../controllers/applicationController')
const { validate, schemas } = require('../middleware/validate')

router.get('/', auth, getAll)
router.get('/stats', auth, getStats)
router.post('/', auth, validate(schemas.createApplication), create)
router.put('/:id', auth, validate(schemas.updateApplication), update)
router.delete('/:id', auth, remove)

module.exports = router
