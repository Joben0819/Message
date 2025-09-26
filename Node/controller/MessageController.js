import Message from "../models/Message.js";
import {addChannel} from './LoginController.js'

export const all_comment = async(req,res) =>{
    const {group} = req.body
    const header  = req.user.username
    const userMessage = await Message.find()
    const subtotal = userMessage.filter((data, index) => 
        data.group === `${group}, ${header}` || data.group === `${header}, ${group}`
    )
    return res.status(200).json({subtotal});
}

export const create_message = async(ws, e, req, wss) =>{
    const {message, group } = JSON.parse(e)
    const allgroup = `${group}, ${req.username}`
    // if(!message){
    //     return res.status(404).json({"messagee": 'no message'})
    // }else{
        addChannel(req, group)
        const overall = {message: message,group: allgroup, 'user_id': req._id, sender: req.username}
        const newmessge = new Message(overall)
        const fetch = await newmessge.save()
        //console.log(fetch)
        // ws.send(JSON.stringify(fetch))
        wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(fetch));
        }
        });
        // return 
    // }
}   