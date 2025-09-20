import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
    try {
        const role = req.user?.role || 'guest';
        let limit;
        let message;

        switch(role){
            case 'admin':
                limit = 20;
                message = "Admin request limit exceeded (20 requests per minute). Slow Down!";
            break;
            case 'user':
                limit = 10;
                message = "User request limit exceeded (10 requests per minute). Slow Down!";
            break;
            case 'guest':
                limit = 5;
                message = "Guest request limit exceeded (5 requests per minute). Slow Down!";
            break;
        }

        const client = aj.withRule(slidingWindow({
            mode: "LIVE",
            interval: '1m',
            max: limit,
            name: `Rate limit for ${role}`
        }));
        const decision = await client.protect(req);

        if (decision.isDenied()) {
            const reason = decision.reason;

            if (reason.isBot && reason.isBot()) {
                logger.warn('Bot request blocked', { ip: req.ip, userAgent: req.headers['user-agent'], path: req.path });
                return res.status(403).json({ error: 'Forbidden', message: 'Automated requests are not allowed.' });
            }

            if (reason.isShield && reason.isShield()) {
                logger.warn('Shield blocked request', { ip: req.ip, userAgent: req.headers['user-agent'], path: req.path });
                return res.status(403).json({ error: 'Forbidden', message: 'Request blocked by security policy.' });
            }

            if (reason.isRateLimit && reason.isRateLimit()) {
                logger.warn('Rate Limit exceeded', { ip: req.ip, userAgent: req.headers['user-agent'], path: req.path });
                return res.status(403).json({ error: 'Forbidden', message: 'Too many requests.' });
            }

            // fallback
            logger.warn('Unknown denial reason', { reason, ip: req.ip });
            return res.status(403).json({ error: 'Forbidden', message: 'Request denied by Arcjet.' });
        }
        next();

    } catch (error) {
        console.error("Error in Arcjet security middleware", error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong with Arcjet security middleware.' });
    }
};


export default securityMiddleware;