const { Router } = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        // 1. Geting our link
        const baseUrl = config.get('baseUrl')
        const { from } = req.body

        // 2. Generate new short link with using 'shortid npm'
        const code = shortid.generate()

        // 3. If link is already in our databese we send it ro front
        const existing =  await Link.findOne({ from })
        if (existing) {
            return res.json({ link: existing })
        }

        // 4. Generate new link and send it
        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()
        res.status(201).json({ link })
        
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' })
    }
})


router.get('/', auth, async (req, res) => {
    try {
        // 1. Find all links for this user with using middleware 'auth' to get id
        const links = await Link.find({ owner: req.user.userId })
        res.json(links)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' })
    }
})


router.get('/:id', auth, async (req, res) => {
    try {
        // 1. Need to find one link
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' })
    }
})

module.exports = router