const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Request ke header se token nikaalo
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

    try {
        // Token ko verify karo (Bearer format hatane ke liye split kiya hai)
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "aasif_secure_key_123");
        req.user = verified; // Yahan se req.user.id set hota hai!
        next(); // Sab sahi hai, aage badho
    } catch (error) {
        res.status(400).json({ message: "Invalid Token!" });
    }
};