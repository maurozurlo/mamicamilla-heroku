require("dotenv").config()
const axios = require('axios')
const qs = require('qs')

const checkCaptcha = async (payload) => {
  let siteKey = process.env.HCAPTCHA_SECRET
  try {
    const siteVerify = await axios({
      method: 'POST',
      url: 'https://hcaptcha.com/siteverify',
      data: qs.stringify({
        response: payload,
        secret: siteKey
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    console.log(siteVerify.data)
    return siteVerify.data.success
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = {
  checkCaptcha
}
