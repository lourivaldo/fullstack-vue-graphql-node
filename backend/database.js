const { Client } = require('pg')

require('dotenv').config()

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

client.connect();

exports.execute = function (query, values) {
    return new Promise((resolve, reject) => {
        client.query(query, values, function (err, res) {
            if (err) reject(err)
            resolve(res.rows)
        })
    });
};
