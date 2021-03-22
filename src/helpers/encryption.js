const bcrypt = require('bcrypt');

const hashPassword = async password => {
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        const hash = await bcrypt.hash(password, salt);
        return hash
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    hashPassword
}