export default async function chatRoute(fastify) {
    fastify.get("/", async (req, reply) => {
        const clientId = req.cookies.clientId;

        if (!clientId || !fastify.cache.has(`${clientId}-connect-with`)) {
            return reply.code(400).send({
                ok: false,
                message: "You are not connected with anyone. Please connect first."
            });
        }

        const oppositeClient = fastify.cache.get(`${clientId}-connect-with`);
        const { newMessage } = req.query;

        const chatKey = [clientId, oppositeClient].sort().join("-chat");

        if (!fastify.cache.has(chatKey)) {
            fastify.cache.set(chatKey, []);
        }

        const chatHistory = fastify.cache.get(chatKey);

        
        if (newMessage) {
            const messageData = {
                from: clientId,
                text: newMessage,
                timestamp: new Date().toISOString()
            };

            chatHistory.push(messageData);
            fastify.cache.set(chatKey, chatHistory);

            return {
                ok: true,
                message: "Message sent.",
                data: messageData
            };
        }

       
        return {
            ok: true,
            chat: chatHistory
        };
    });


}
