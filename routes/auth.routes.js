const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Wrong email type').isEmail(),
        check('password', 'Minimum length 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        // 1. Checking email and password validation on backend
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect registration data'
            })
        }
        // 
        const { email, password } = req.body
        // 2. Checking unique email
        const candidate = await User.findOne({ email })
        if (candidate) {
            return res.status(400).json({ message: 'Such user already exists' })
        }
        // 
        // 3. Encrypt password
        const hashPassword = await bcrypt.hash(password, 12)
        // 
        // 4. Adding new user, after all audits, to the Database
        const user = new User({ email, password: hashPassword })
        await user.save()
        res.status(201).json({ message: 'User successfully has been created' })
        // 
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' })
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter the password').exists()
    ],
    async (req, res) => {
    try {
        // 1. Checking email and password validation on backend
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }
        // 
        // 2. Checking existing of user by 'email'
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: 'User not found' })
        }
        // 
        // 3. Checking matching of both password from Database and entered
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password, try again' })
        }
        // 
        // 4. Creatig token
        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' } // one hour
        )
        res.json({ token, userId: user.id })
        
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' })
    }
})

module.exports = router