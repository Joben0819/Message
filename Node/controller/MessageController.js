import Message from "../models/Message.js";
import {addChannel} from './LoginController.js'
import Users from "../models/Users.js";
export const all_comment = async(req,res) =>{
    const {group} = req.body
    const header  = req.user.username
    const userMessage = await Message.find()
    const subtotal = userMessage.filter((data, index) => 
        data.group === `${group}, ${header}` || data.group === `${header}, ${group}`
    )
    return res.status(200).json({subtotal});
}

export const other_comment = async(req,res) =>{
    //const {group} = req.body
    const header = req.user.username
    const userData = await Users.findOne({_id: req.user._id})
    const userMessage = await Message.find()
    const groupList = userData.channel.split(',')
    const subtotal = userMessage.filter((data, index) => {
        const user = data.group.split(',')
        if(user[0] === header){
            return groupList.find(data => data === user[1].trim()) !== user[1].trim() ? data : null
        }
    })
    return res.status(200).json({subtotal});
}

export const create_message = async(ws, e, req, wss) =>{
    if(JSON.parse(e).type){
        // const message = JSON.parse(e)
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(e.toString());
            }
        });
    }else{
        const {message, group } = JSON.parse(e)
        //CONSOLE.log(JSON.parse(e), 'message')
        const allgroup = `${group}, ${req.username}`
        if(!message){
            return res.status(404).json({"messagee": 'no message'})
        }else{
            addChannel(req, group)
            const overall = {message: message,group: allgroup, 'user_id': req._id, sender: req.username}
            const newmessge = new Message(overall)
            const fetch = await newmessge.save()
            console.log(fetch)
            ws.send(JSON.stringify(fetch))
            wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(fetch));
            }
            });
            // return 
        }
    }
}   