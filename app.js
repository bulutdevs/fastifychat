import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cache from './cache.js'
import path from 'path'

// import routes
import main from './routes/main.js'
import newCode from './routes/newCode.js'
import connectCode from './routes/connectCode.js'
import unConnect from './routes/unConnect.js'
import chat from './routes/chat.js'

export default function app() {
    const app = Fastify({
        logger: false
    })

    // decorate cache
    app.decorate('cache', cache)

    app.register(cookie, {
        secret: 'your-secret'
    })
  
    // register routes

    app.register(main, { prefix: "/" })
    app.register(newCode, { prefix: "/newCode" })
    app.register(connectCode, { prefix: "/connectCode" })
    app.register(unConnect, { prefix: "/unConnect" })
    app.register(chat, { prefix: "/chat" })


    return app;
}