
const jwt = require("jsonwebtoken");
const { prisma } = require("../DB/db.config");
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        
        if (!decoded) {
            return res.status(401).json({ msg: "Invalid token" });
        }

        const user = await prisma.user.findFirst({ where: { id: decoded.userId } });
        const admin = await prisma.admin.findFirst({ where: { id: decoded.userId } });
        const entity = user || admin;

        if (!entity) {
            return res.status(404).json({ msg: "User not found" });
        }

        const { password, ...entityWithoutPassword } = entity;
        req.user = entityWithoutPassword;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ msg: "Unauthorized - Token has expired" });
        } else {
            res.status(500).json({ msg: "Internal Server Error" });
        }
    }
};

