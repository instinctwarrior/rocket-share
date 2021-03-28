const { Sequelize } = require('sequelize')

const {
    DB_USER, DB_NAME, DB_PASS, DB_HOST, DB_PORT
} = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT
})

async function test() {
    db.authenticate()
        .then()
        .catch(console.error)
}

module.exports = db