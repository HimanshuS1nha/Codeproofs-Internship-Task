import { connect } from "mongoose";

export default async function connectToDB() {
  await connect(process.env.MONGO_URI);
}
