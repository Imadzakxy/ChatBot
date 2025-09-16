import jwt from "jsonwebtoken";
import User from "../schemas/User.schema.js";

export const userLoggedInController = (request, response, next) => {
  const { authorization } = request.cookies;
  if (!authorization) {
    return response
      .status(401)
      .json({ msg: "No authorization token provided" });
  }

  jwt.verify(
    authorization,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        return response.status(401).json({ msg: "Invalid or expired token" });
      }

      try {
        const user = await User.findOne({ username: decoded.username });
        if (!user) {
          return response.status(404).json({ msg: "User not found" });
        }

        if (!user.accessToken || authorization !== user.accessToken) {
          return response.status(401).json({ msg: "User is not logged in" });
        }

        request.payload = decoded;
        next();
      } catch (error) {
        return response.status(500).json({ msg: "Authentication failed" });
      }
    }
  );
};
