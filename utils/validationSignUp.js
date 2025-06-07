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

module.exports = {signUpValidation}