// import modules
import startApp from './app.js'
import dotenv from 'dotenv'

// upload .env
dotenv.config()

// import env
const PORT = process.env.PORT || 3002


// server side
const app = startApp()

const start = async() => {
    try {
        await app.listen({port: PORT, host: '0.0.0.0'})
        app.log.info("The server started succesful.")
    } catch(e) {
        app.log.error(`Error occured: ` + e);
        process.exit(1)
    }
}


// start server
start()