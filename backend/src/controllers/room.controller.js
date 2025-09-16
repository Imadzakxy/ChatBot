import User from "../schemas/User.schema.js";
import Room from "../schemas/Room.schema.js";
import jwt from "jsonwebtoken";

export const getRoomsController = async (request, response) => {
  try {
    const user = await User.findOne({ username: request.payload.username });

    if (!user) {
      return response.status(404).json({ msg: "User not found" });
    }

    return response
      .status(200)
      .json(await Room.find({ _id: { $in: user.rooms } }));
  } catch (error) {
    return response.status(500).json({ msg: "Failed to fetch rooms" });
  }
};

export const postRoomController = async (request, response) => {
  try {
    const user = await User.findOne({ username: request.payload.username });
    if (!user) return response.status(404).json({ msg: "User not found" });
    user.rooms.push((await new Room({ user: user._id }).save())._id);
    await user.save();
    return response
      .status(201)
      .json({
        id: user.rooms[user.rooms.length - 1],
        msg: "Room created successfully",
      });
  } catch (error) {
    return response.status(500).json({ msg: "Failed to create room" });
  }
};

export const postMessageController = async (request, response) => {
  const {
    body: { isFromBot, content },
    params: { id },
  } = request;
  try {
    if (isFromBot === undefined || !content)
      return response
        .status(400)
        .json({ msg: "Missing required fields: id, content, and isFromBot" });
    if (typeof isFromBot !== "boolean") {
      return response.status(400).json({
        msg: "isFromBot must be a boolean value",
      });
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return response.status(400).json({
        msg: "Content must be a non-empty string",
      });
    }
    const room = await Room.findOne({ _id: id });
    if (!room) return response.status(400).json({ msg: "Room not found" });
    room.conversations.push({
      time: new Date(),
      content: content.trim(),
      isFromBot,
    });
    await room.save();
    return response.status(201).json({ msg: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Failed to send message" });
  }
};
export const getRoomController = async (request, response) => {
  const { id } = request.params;
  try {
    const room = await Room.findOne({ _id: id });
    if (!room)
      return response.status(404).send({ msg: "The Room Does not Exist" });
    return response.status(200).json({ room });
  } catch (error) {
    return response.status(500).json({ msg: "Failed to get room" });
  }
};
