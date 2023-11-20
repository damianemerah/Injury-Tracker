import connectDB from "../middleware/mongodb";
import User from "../models/user";

console.log("user route🌐🌐🌐");

export async function POST(req, res) {
  const { name, email, password } = req.body;
  console.log("req.body🔥🔥🔥", req.body);
  if (name && email && password) {
    try {
      var user = new User({ name, email, password });
      var usercreated = await user.save();
      return res.status(200).send(usercreated);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  } else {
    res.status(422).send("data_incomplete");
  }
}
