import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limirt: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import resultRouter from "./routes/student.router.js";
import adminRouter from "./routes/admin.router.js";

//routes declaration
app.use("/api/v1/result", resultRouter);
app.use("/api/v1/admin", adminRouter);

export { app };
