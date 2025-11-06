const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    let token = req.header('Authorization');
    
    console.log(token);
    console.log(token);
    if (!token) return res.status(401).json({ error: 'Access denied' });

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("🔥 Full error:", err); // full object
        console.error("🔥 Error keys:", Object.keys(err)); // see what properties exist
        res.status(400).json({
            error: err.message,
            code: err.code || null,
            stack: err.stack || null,
            details: err.errorInfo || err.info || null
        });
    }
}

module.exports = { verifyToken };
