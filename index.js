import express from "express";
import mongoose from "mongoose";
import useRouter from "./routes/api.js";
import jwt from 'jsonwebtoken'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
const app = express();
const PORT = 3001;
app.use(express.urlencoded({ extended: true }));
// Create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Serve static files
// app.use(express.static(path.join(__dirname, 'dist')));
// // For any route, send the React index.html
// app.get('/:name', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist', 'index.html'));
// });
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist', 'index.html'));
// });
// app.get('/assets/:name' , (req, res) => {
//   const {name} = req.params
//   res.sendFile(path.join(__dirname, '../dist/assets', name));
// });
// http://localhost:3001/assets
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist', 'index.html'));
// });

// app.get('/assets/index-BMDFlihq.js', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/assets', 'index-BMDFlihq.js'));
// });



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

// 1. API Routes First (so they don't get swallowed by the wildcard)

app.use("/api", useRouter);

// 2. Static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "Frontend/dist")));

// 3. SPA Fallback (MUST be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/dist/index.html"));
});


// const secretKey = "00";
// app.post("/login", (req,res)=>{
//   const user = {name: "Ven"} 
//   const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
//   res.json({token: token})
// })

// app.get("/dashboard", authenticateToken, (req, res) => {
//   res.json({ message: `Welcome this ${req.user.name} is your dashboard!` });
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// const sslOptions = {
//     key: fs.readFileSync("./cert/server.key"),
//     cert: fs.readFileSync("./cert/server.crt"),
// };

// Https.createServer(sslOptions, app).listen(3001, "0.0.0.0", () => {
//     console.log("HTTPS server running on https://192.168.254.108:3001");
// });