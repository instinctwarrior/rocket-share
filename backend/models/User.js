const db = require('../config/db')
const { DataTypes } = require('sequelize')
const Joi = require('joi')
const bcyrpt = require('bcrypt')

// user schema
const UserSchema = {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

// user model
const User = db.define('User', UserSchema, {
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
})

// hash the password before saving the user object to the database
User.beforeSave(async function(user, options) {
    user.password = await bcyrpt.hash(user.password, 10)
})

// Sequelize validationErrorHandler
function validationErrorHandler(err) {
    let errMessage = ''

    console.log(err?.errors[0]?.message)
    console.log(err?.errors[0]?.path)
    
    if (err?.errors[0]?.message) 
        if (err.message === 'Validation error')
            if (err?.errors[0]?.path === 'Users.users_email')
                errMessage = 'Email ID must be unique'
            else if (err?.errors[0]?.path === 'Users.username')
                errMessage = 'Username must be unique'
    else
        errMessage = 'Database Runtime Error'

    // return new Error(errMessage)
    return errMessage
}

async function test() {
    // await db.sync({force: true})

    try {
        await User.create({
            name: 'Kaushik Rishi Manchukonda',
            password: 'Kamal_123',
            email: 'ninja@asdfsdfsemaasdfasdfsil.cosdfgsdgfdm'
        })
    } catch (err) {
        throw validationErrorHandler(err)
    }
}

// test()

// Joi user validation
function validateUser(user, soft=false) {
    let valSchema = Joi.object({
        name: Joi
                .string()
                .min(5)
                .max(20)
                .required(),
        email: Joi
                .string()
                .email({ tlds: { allow: false } })
                .required(),
        password: Joi
                .string()
                .min(5)
                .max(30)
                .required()
    })

    let valSchemaSoft = Joi.object({
        email: Joi
                .string()
                .email({ tlds: { allow: false } })
                .required(),
        password: Joi
                .string()
                .min(5)
                .max(30)
                .required()
    })

    
    // let {error} = valSchema.validate(user)
    // return error?.details[0]?.message

    if (soft === true) 
        return valSchemaSoft.validate(user)
    return valSchema.validate(user)
}

// console.log(validateUser({
//     name: 'Kaushik Rishi Manchukonda',
//     password: '123',
//     email: 'ninja@asdfsdfsemaasdfasdfsil.cosdfgsdgfdm'
// }))

module.exports = {
    User,
    validateUser,
    validationErrorHandler
}