// connectCode.js
import crypto from "crypto";

export default async function main(fastify) {
    fastify.get("/", async (req, reply) => {
        fastify.log.info("Unconnect route accessed.");

        let clientId = req.cookies.clientId;
        if (!clientId) {
            clientId = crypto.randomUUID();
            reply.setCookie("clientId", clientId, {
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60
            });
        }


        //cache control
        if (!fastify.cache.has(clientId)) return { ok: false, message: `You don't have any code.` }
        if (!fastify.cache.has(`${clientId}-connect-with`)) return { ok: false, message: `You are not connected anyone.` }

        const oppositeClient = fastify.cache.get(`${clientId}-connect-with`);
        fastify.cache.delete(`${clientId}-connect-with`);
        fastify.cache.delete(`${clientId}-connect-with-code`);
        fastify.cache.delete(`${oppositeClient}-connect-with`);
        fastify.cache.delete(`${oppositeClient}-connect-with-code`);


        fastify.log.info(`${clientId} disconnected from ${oppositeClient}`);

        return reply.send({
            ok: true,
            message: "You have been disconnected successfully."
        });
    })
}