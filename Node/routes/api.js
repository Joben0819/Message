import express, { json } from'express'
import {WebSocketServer} from "ws";
import { all_comment,create_message, other_comment } from '../controller/MessageController.js';
import jwt from "jsonwebtoken"
import {authenticateToken, authenticateWsConnection} from "../middleware/authMiddleware.js";
import { Login, Register,  AllUser, SearchUser} from '../controller/LoginController.js';
import http from "http";
const server = http.createServer();
const wss = new  WebSocketServer({server})
const router = express.Router()

router.post('/login', Login)
router.post('/register', Register)
function withAuth(handler){
    return async(ws, req) =>{
        //const user = await authenticateWsConnection(req)
        // if(!user){
        //     ws.close()
        //     console.log('here')
        // }
        handler(ws, req)
    }
}
wss.on("connection", withAuth((ws, req, user) =>{
        const token = req.headers["sec-websocket-protocol"]
    //console.log('connected')
    const secretKey = "00"
    if(token){
        try{
        const jwt_token = jwt.verify(token, secretKey)
        console.log(jwt_token, 'ss')
        ws.on("message",  (e) =>{
            console.log(JSON.parse(e), 'message')
            console.log("📱 PHONE RECEIVED:", e);
            create_message(ws, e, jwt_token,wss)
            // wss.clients.forEach((client) => {
            //     if (client !== ws && client.readyState === 1) {
            //         client.send(message.toString());
            //     }
            // });
        })
        }catch(err){
            //console.log(err, 'error')
            ws.close()
        }
        // if(jwt_token){

        // }
    }
    //ws.send(JSON.stringify(jwt_token.username), 'hellow world')
}))

// wss.on("connection", (ws, req) => {
//   console.log("🔥 WebSocket CONNECTED");
//   console.log("Client IP:", req.socket.remoteAddress);

//   ws.on("message", (message) => {
//     console.log("📩 Message:", message.toString());
//   });

//   ws.on("close", () => {
//     console.log("❌ WebSocket CLOSED");
//   });

//   ws.on("error", (err) => {
//     console.log("❌ WebSocket ERROR:", err);
//   });
// });


console.log("WebSocket server running on ws://localhost:8080");
server.listen(8080, "0.0.0.0", () => {
  console.log("WebSocket server running on ws://0.0.0.0:8080");
});
router.use(authenticateToken)

router.post('/allcomment', all_comment)
router.post('/othercomment', other_comment)
router.post('/users', authenticateToken, AllUser)
router.post('/searchuser', SearchUser)
export default router