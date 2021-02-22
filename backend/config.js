require('dotenv').config()

const app = {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT
}

const db = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    url: process.env.DB_URL
}

console.log(app.db)