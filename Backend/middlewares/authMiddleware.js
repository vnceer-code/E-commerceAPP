import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token) {
        token = token.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded;
    next();
}

export const authorize = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
         return next();
    }
    return res.status(403).json({ message: 'Admin access denied' });
}