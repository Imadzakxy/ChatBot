import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    accessToken: {
      type: String,
      unique: false,
      required: false,
    },
    rooms: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Room",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
