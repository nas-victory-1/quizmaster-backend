import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ADDED UNIQUE CONSTRAINT
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
