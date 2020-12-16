//load lib: mysql, mongo, express, morgan
const express = require('express')
const morgan = require('morgan')
const { MongoClient, ReplSet } = require('mongodb')
const mysql = require('mysql2/promise')
const { mkQuery, gameReviews } = require('./db_utils')

//declare mongo db const
const MONGO_DB = 'boardgames'
const MONGO_COLLECTION = 'reviews'

//configure msql database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'mario',
    password: process.env.DB_PASSWORD || 'q1w2e3r4',
    database: process.env.DB_NAME || 'bgg',
    connectionLimit: 4,
    timezone: '+08:00'
})

//configure the MONGO database
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const mongoClient = new MongoClient(MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})

//configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

//create app 
const app = express()
app.use(morgan('combined'))

// GET /game/:id -> mongo
app.get('/game/:gid', async (req, res) => {
    const gid = parseInt(req.params['gid'])
    res.type('application/json')

    try {
        const p0 = findGameById([gid])
        const p1 = gameReviews(gid, client.db(MONGO_DB).collection(MONGO_COLLECTION))

        const [game, reviews] = await Promise.all([ p0, p1 ])
        if (game.length <= 0) {
            res.status(404)
            res.json({message: `Cannot find game ${gid}`})
            return
        }
            res.status(200)
            res.json({
                gid: game[0].gid,
                name: gamee[0].name,
                year: game[0].year,
                url: game[0].url,
                image: game[0].image,
                ...reviews[0]
            })

    } catch (e) {
        res.status(500)
        res.type('application/json')
        res.json({ error: e })
    }
})

//start server
//check databases are up before starting the server 
//IIFE -> immediately execute the function
const p0 = (async () => {
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release
    return true
})()

const p1 = (async () => {
    await mongoClient.connect()
    return true
})()

Promise.all([p0, p1])
    .then((r) => {
        app.listen(PORT, () => {
            console.info(`Application started on port ${PORT} at ${new Date()}`)
        })
    })