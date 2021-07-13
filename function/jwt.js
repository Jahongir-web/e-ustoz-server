const { verify, sign } = require('jsonwebtoken')

const SECRET = 'musobek'

module.exports = {
    sign: payload => sign(payload, SECRET),
    verify: token => verify(token, SECRET)
}