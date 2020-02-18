require('dotenv').config()
const axios = require('axios')
const { SHOPIFY_BASE_URL } = process.env

module.exports = axios.default.create({
    baseURL: SHOPIFY_BASE_URL,
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
    },
    timeout: 5000
})