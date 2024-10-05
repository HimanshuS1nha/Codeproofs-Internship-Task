import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import connectToDB from "./libs/db.js";
import Users from "./models/UsersModel.js";

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("Hello World"));

app.post("/api/add-email", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });
    if (user) {
      return res.status(409).json({ error: "Email already exists" });
    }

    await Users.create({ email });

    return res.status(200).json({ message: "Email added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

connectToDB().then(() =>
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
);

export default app;
