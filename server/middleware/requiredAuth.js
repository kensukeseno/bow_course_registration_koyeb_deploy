import jsonwebtoken from "jsonwebtoken";

export default function requireAuth(requiredRole = null) {
  return function (req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      req.user = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      // Check if a specific role is required for the resource
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
