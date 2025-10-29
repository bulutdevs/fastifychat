// connectCode.js
import crypto from "crypto";

export default async function main(fastify) {
    fastify.get("/", {
        schema: {
            querystring: {
                type: "object",
                required: ["connectCode"],
                properties: {
                    connectCode: {
                        type: "string",
                        pattern: "^[0-9]{6}$",
                        description: "6-digit connection code"
                    }
                }
            }
        }
    }, async (req, reply) => {
        fastify.log.info("Connect code route is accesed now.");

        let clientId = req.cookies.clientId;
        const { connectCode } = req.query


        if (!clientId) {
            clientId = crypto.randomUUID();
            reply.setCookie("clientId", clientId, {
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60
            });
        }


        //cache control
        if (!fastify.cache.has(clientId)) return { ok: false, message: `You haven't any code.` }
        if (fastify.cache.has(`${clientId}-connect-with`)) {
            console.log(`${clientId} (${fastify.cache.get(`${clientId}`)}) is connected with ${fastify.cache.get(`${clientId}-connect-with`)} (${fastify.cache.get(`${clientId}-connect-with-code`)})`)
            return reply.code(400).send({
                ok: false,
                message: `You already connected with ${fastify.cache.get(`${clientId}-connect-with-code`)}.`,
                yourCode: fastify.cache.get(clientId)
            });
        }

        let oppositeClient;
        const connectCodeStr = connectCode.toString();
        for (const [key, value] of fastify.cache.entries()) {
            const valueStr = value.toString()
            console.log("ValueStr: " + valueStr)
            console.log("ConnectCode: " + connectCodeStr)

            if ((key.includes("-")) && valueStr === connectCodeStr) {
                oppositeClient = key;
                console.log(oppositeClient)
                break;
            }
        }

        if (!oppositeClient) return { ok: false, message: `Not found client for ${connectCode}.` };
        
        if (fastify.cache.has(`${oppositeClient}-connect-with`)) return { ok: false, message: `Something went wrong while connecting.` }

        fastify.cache.set(`${clientId}-connect-with`, oppositeClient)
        fastify.cache.set(`${clientId}-connect-with-code`, connectCodeStr)
        fastify.cache.set(`${oppositeClient}-connect-with`, clientId)
        fastify.cache.set(`${oppositeClient}-connect-with-code`, fastify.cache.get(clientId))

        return { ok: true, message: "You connected sucecssful." };
    })
}