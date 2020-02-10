//import following through node
const mongoose = require('mongoose')
const crypto = require('crypto')

//create new schema for users
const userSchema = new mongoose.Schema({ 
    // following fields included
    name: { 
        type: String, 
        trim: true, 
        required: true, 
        max: 32
    }, 
    email: { 
        type: String, 
        trim: true, 
        required: true,
        unique: true, 
        lowercase: true
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Note"
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark"
    }],
    hashed_password: { 
        type: String,
        required: true, 
    }, 
    salt: String, 
    role: { 
        type: String, 
        default: 'user'
    }, 
    resetPasswordLink: {
        data: String, 
        default: ''
    }
    }, { timestamps : true })

//virtual method with crypto for password
userSchema.virtual('password')
.set(function(password){
    //use salt in makesalt function below
    this._password = password
    this.salt = this.makeSalt()
    //take hashed password that has been encrypted function below
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//methods
userSchema.methods = {
    authenticate: function(plainText) { 
        return this.encryptPassword(plainText) === this.hashed_password; 
    },
    // encrypting function using hmac. 
    encryptPassword : function(password) {
        if (!password) return ""
        try { 
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch (err) {
            return ""
        }
    }, 
    //salt using randomizing numbers and letters
    makeSalt: function() { 
        return Math.round(new Date().valueOf() * Math.random())+""
    }
}

// export users model
module.exports = mongoose.model("User", userSchema)