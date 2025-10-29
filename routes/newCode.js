// newcode.js
import crypto from "crypto";

export default async function main(fastify) {
    fastify.get("/", async (req, reply) => {
        fastify.log.info("Generating new code route accessed.");

        let clientId = req.cookies.clientId;
        const { recode } = req.query
        const forceRecode = recode === "true" || recode === true;

        if (!clientId) {
            clientId = crypto.randomUUID();
            reply.setCookie("clientId", clientId, {
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60
            });
        }


        //cache control

        if (!forceRecode && fastify.cache.has(clientId)) {
            return reply.code(400).send({
                ok: false,
                message: "Client already has a code.",
                recode: "If you wanna re-genarate, you can go this route with '?recode=true'",
                code: fastify.cache.get(clientId)
            });
        }


        const code = crypto.randomInt(100000, 999999).toString();
        fastify.cache.set(clientId, code);
        fastify.log.info(`Generated new code ${code} for client ${clientId}`);
        return { ok: true, code };
    })
}