import mongoose from "mongoose";

//type sprain, fracture...

const injurySchema = new mongoose.Schema({
  reporter: { type: String, required: true },
  injuries: [
    {
      bodyMap: {
        type: String,
        required: true,
      },
      part: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mongoose.models = {};

const Injury = mongoose.model("Injury", injurySchema);

export default Injury;
