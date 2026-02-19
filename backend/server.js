import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import testRoutes from './routes/testRoutes.js'
import questionRoutes from './routes/questionRoutes.js'
import resultRoutes from './routes/resultRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use('/api/tests', testRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/results', resultRoutes)

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
