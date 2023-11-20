import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [
      function () {
        return this.accountType === "email";
      },
      "Email is required",
    ],
  },
  username: {
    type: String,
    required: [
      function () {
        return this.accountType === "username";
      },
      "Username is required",
    ],
  },
  name: {
    type: String,
    required: [
      function () {
        return this.accountType === "email";
      },
      "Name is required",
    ],
  },
  accountType: {
    type: String,
    required: true,
    enum: ["username", "email", "google"],
  },

  password: { type: String, required: true },
  since: { type: Date, default: Date.now },
  injuries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Injury" }],
});

UserSchema.index({ email: 1, username: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
