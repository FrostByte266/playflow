import mongoose from 'mongoose'

const DB = process.env.DB || 'test'


const conString =  process.env.CONSTRING || `mongodb://localhost:27017/${DB}`

mongoose.connect(conString)

const db = mongoose.connection

db.on('connected', () => {
    console.log(`Connected to MongoDB with connection string: ${conString}`)
})
