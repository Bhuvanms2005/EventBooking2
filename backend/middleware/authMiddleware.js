const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid or has expired" });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || !['Admin', 'Super Admin'].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
};

module.exports = { protect, adminOnly };

