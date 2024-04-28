const jwt = require("jsonwebtoken");
const { prisma } = require("../DB/db.config");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "Unauthorized - No token provided" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) {
            return res.status(401).json({ msg: "Invalid token" });
        }
        const user = await prisma.user.findFirst({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error or token expire" });
    }
};
