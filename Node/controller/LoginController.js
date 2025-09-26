import User from '../models/Users.js'
import jwt from 'jsonwebtoken'
// CREATE user
import { v4 as uuidv4 } from "uuid"
let secretKey = "00"
export const Login = async(req,res) =>{
    const {username, password} = req.body
    if(typeof password !== 'number'){
      return res.status(404).json({'message': 'password must be number'})
    }
    if(typeof username !== 'string'){
      return res.status(404).json({'message': 'username must be text'})
    }
    if(!username){
      return res.status(404).json({'message': 'no usernames'})
    }
    if(!password){
      return res.status(404).json({'message': 'no password'})
    }
    const data = await User.find({username: username, password: password})
    if(data.length === 0){
      return res.status(404).json({message: 'wrong password and username'})
    }
    const map = data.map(val=> {
    const {password, ...rest} = val['_doc']
        return { ...rest}
    
    })
    const user_id = uuidv4();
     await User.updateOne(
    { _id: map[0]['_id'] },  // filter
    { $set: { session: user_id } } // update
    );
    map[0].session = user_id
    const token = jwt.sign(map[0], secretKey, {expiresIn: "1h"})
    map[0].token = token
    res.json(map[0])
}

export const Register = async (req, res) => {
      const {username, password} = req.body
    if(typeof password !== 'number'){
      return res.status(404).json({'message': 'password must be number'})
    }
    if(typeof username !== 'string'){
      return res.status(404).json({'message': 'username must be text'})
    }
    if(!username){
      return res.status(404).json({'message': 'no usernames'})
    }
    if(!password){
      return res.status(404).json({'message': 'no password'})
    }
  // try {
    const user_id = uuidv4();
    const body = {...req.body, session: user_id, channel: ''}
    const double = await User.find(req.body);
    const user = new User(body);
    if(double.length === 0){
      const save = await user.save();
      const obj = save.toObject();
      const token = jwt.sign(obj, secretKey, {expiresIn: "1h"})
       obj.password = ''
      obj.token = token
      console.log(obj, 'obj')
      res.status(200).json(obj);
    }else{
      res.status(404).json('duplicate')
    }
  // } catch (err) {
  //   res.status(400).json({ error: err.message });
  // }
};

export const AllUser = async(req, res) =>{
  const user = await User.find({'_id': req.user['_id']})
  const users_all = await User.find()
  const split = user[0].channel.split(',')
  const map = users_all.map(val=> {
  const {password, ...rest} = val['_doc']
      return { ...rest}
  
  })
  return res.status(200).json({"persons": map.filter(data => split.includes(data.username))})
}

export const addChannel = async(data, user) =>{
  const find_data = await User.find({'_id': data['_id']})
  const plus_channel = find_data[0].channel.split(",")
  const filter_plus = plus_channel.filter(data => data !== '')
  console.log(plus_channel.find(data => data === user),!plus_channel.find(data => data === user))
  if(!filter_plus.find(data => data === user)){
      plus_channel.push(user)
      await User.findByIdAndUpdate(
      data['_id'],
      {channel: filter_plus.length === 0 ? user : plus_channel.join()}
      
    )
  }
}

export const SearchUser = async(req, res) =>{
  const {username} = req.body
  const users_all = await User.find({username: username})
  return res.status(200).json({"persons": users_all})
}