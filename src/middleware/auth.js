require('dotenv').config({ path: "./.env" });
const { checkCaptcha } = require('./captcha')
const jwt = require('jsonwebtoken')

const verifyTokenOrCaptcha = async (req, res, next) => {
    //If authenticated, we skip the captcha but log it
    const token = req.headers['x-access-token']
    if (!token) {
        //Check captcha
        const captcha = await checkCaptcha(req.body.hcaptcha)
        delete req.body.hcaptcha //We don't need that no more
        if (!captcha) { return res.status(403).json({message:'Wrong or missing captcha'}) }
    }
    if (token) {
        //If we do have a token, we must check it
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = decoded.id

        } catch (error) {
            return res.status(403).json({ auth: false, message: 'Failed to authenticate token' })
        }
    }
    next()
}

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token)
        return res.status(403).json({ auth: false, message: 'No token provided' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next()
    } catch (error) {
        return res.status(403).json({ auth: false, message: 'Failed to authenticate token' })
    }
}

const verifyAndDecodeToken = token => {
    if (!token) return false
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) return false
    return decoded
}

const saveSession = (req, res, next) => {
    if (req.query.token) {
        const decodedToken = verifyAndDecodeToken(req.query.token)
        if (!decodedToken) return res.status(403).json({ message: 'Failed to authenticate token' })
        if (decodedToken) {
            req.session.admin = 'admin'
            req.session.userId = decodedToken.id
            req.session.username = decodedToken.username
            next()
        }
    } else {
        if (req.session.admin === 'admin') {
            next()
        } else {
            res.redirect("/admin")
        }
    }
}

const verifySession = (req, res, next) => {
    if (req.session.admin === 'admin') {
        next()
    } else {
        res.redirect("/")
    }
}

module.exports = {
    verifyTokenOrCaptcha,
    verifyToken,
    saveSession,
    verifySession
}
