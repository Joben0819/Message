import express from "express";
import mongoose from "mongoose";
import useRouter from "./routes/api.js";
import jwt from 'jsonwebtoken'
import cors from 'cors'
const app = express();
const PORT = 3001;
app.use(express.urlencoded({ extended: true }));
app.post("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors());

app.use(express.json());
// MongoDB connection
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://crinazac20_db_user:AnneKathleen0601@cluster0.h89mfqi.mongodb.net/exam?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("connect");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
connect();

app.use("/api", useRouter);
const secretKey = "00";
// app.post("/login", (req,res)=>{
//   const user = {name: "Ven"} 
//   const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
//   res.json({token: token})
// })

// app.get("/dashboard", authenticateToken, (req, res) => {
//   res.json({ message: `Welcome this ${req.user.name} is your dashboard!` });
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
