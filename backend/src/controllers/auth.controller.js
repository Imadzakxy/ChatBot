import User from "../schemas/User.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../mailtrap/mailtrap.config.js";

export const registerController = async (request, response) => {
  const { username, password, email, confirmPassword } = request.body;
  try {
    if (!username || !password || !email || !confirmPassword)
      return response
        .status(400)
        .json({ msg: "Please Provide All The Fields" });
    if (password !== confirmPassword)
      return response.status(400).json({ msg: "Passwords do not match" });

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user)
      return response.status(400).json({
        msg:
          user.email === email
            ? "This Email Is Already Associated With An Account"
            : "This Username Is Already Taken",
      });

    const createdUser = await new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    }).save();

    // await client.send({
    //   from: {
    //     email: process.env.MAIL_TRAP_EMAIL_SENDER,
    //     name: "ChatBot",
    //   },
    //   to: [{ email: "chatbotusthb2005@gmail.com" }],
    //   template_uuid: process.env.TEMPLATE_UUID,
    //   template_variables: {
    //     username: createdUser.username,
    //   },
    // });

    return response.status(201).json({ msg: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      msg: "An error occurred during registration. Please try again later.",
    });
  }
};

export const loginController = async (request, response) => {
  const { email, password, username } = request.body;
  try {
    if (!(email || username) || !password)
      return response
        .status(400)
        .json({ msg: "Please provide all required fields" });
    const usernameOrEmail = email || username;
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    if (!user) return response.status(400).json({ msg: "Invalid credentials" });

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword)
      return response.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    response.cookie("authorization", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.accessToken = token;

    await user.save();

    return response.status(200).json({ msg: "Login successful", username: user.username });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "An error occurred during login. Please try again later." });
  }
};

export const logoutController = async (request, response) => {
  try {
    const user = await User.findOne({ username: request.payload.username });

    // Clear the token from the database
    await user.updateOne({ $unset: { accessToken: "" } });

    // Clear the cookie
    response.clearCookie("authorization", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    return response.status(500).json({
      msg: "An error occurred during logout. Please try again later.",
    });
  }
};
