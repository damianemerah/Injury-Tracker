import dbConnect from "../../../middleware/mongodb";
import User from "../../../models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const { name, email, password, accountType, username } = body;

    const user = await User.create({
      email,
      username,
      name,
      password,
      accountType,
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      console.log("🔗🔗🔗", error.code, error.name);
      if (error.code === 11000 && error.name === "MongoServerError") {
        const value = error.message.match(/(?<=")[^"]*(?=")/);
        const message = `${value} already exists`;

        return NextResponse.json(
          {
            status: "fail",
            message,
            err: error.message,
            error,
          },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      {
        error: error,
        status: "error",
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
}
