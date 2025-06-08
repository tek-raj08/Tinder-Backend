const validator = require("validator")

const signUpValidation = (req) => {
    const { firstName, lastName, emailID, password } = req.body

    if (!firstName || firstName.length > 25) {
        throw new Error("First Name is required and must be less than 25 characters.")
        
    }

    if (!lastName && lastName.length > 25) {
        throw new Error("Last Name is required and must  be less than 25 characters.")

    }

    if (emailID && !validator.isEmail(emailID)) {
        throw new Error("Enter valid email ID.")
    }

    if (password && !validator.isStrongPassword(password)) {
        throw new Error("Enter strong password.")
    }


}

const validateProfileData = (req) => {

    const allowededFields = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"]

    const isAllAllowedFields  = Object.keys(req.body).every((field) => allowededFields.includes(field))

    return isAllAllowedFields
}

const validatePassword = (req) => {
    const allowededFields = ["password"]

    const isAllAllowedFields = Object.keys(req.body).every((k) => allowededFields.includes(k))
    return isAllAllowedFields
}

module.exports = {signUpValidation, validateProfileData, validatePassword}