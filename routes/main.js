export default async function main(fastify) {
    fastify.get("/", (req, reply) => {
        fastify.log.info("Main route accessed.");
        const clientId = req.cookies.clientId || "unknown";
        console.log(clientId)
        const code = fastify.cache.get(clientId) || "No code assigned yet.";

        return {
            ok: true,
            message: "All of them are working.",
            cache: fastify.cache.size, code,
            help: {
                newCode: "If you wanna create new code, you can go to '/newCode' route. If you wanna regenarate code: '/newCode?recode=true'",
                connectCode: "If you wanna connect another code, you can go to '/connectCode'",
                chat: "If you wanna chat with another person, you can go to '/chat' but firstly you should connect with person."
            }
        }
    })
} 