//import the following from node
const {validationResult} = require("express-validator")

//runt through validation - send callback of results
exports.runValidation = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    next();
}