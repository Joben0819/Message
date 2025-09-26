import  React, { useEffect } from 'react'
import styles from './style.module.scss'
import { Zustand } from '../../store'
import Input from '../../reusable/Input'
import Button from '../../reusable/Buttons'
import icon_user from '../../assets/user.png'
interface Tcontent{
  api: Tsub_content;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  user: string;
}
interface Tsub_content{
  subtotal: [];
}
interface data{
  message: string
  sender: string
}
const Content = ({api, onSubmit, user}: Tcontent) => {
const {session} = Zustand()
  useEffect(()=>{
    console.log(api)
  },[api])

  return (
    <div className={styles.Content}>
      <div className={styles.user} >
        <img src={icon_user} alt="user" style={{display: user.length !== 0 ? '' : 'none'}} />  <span style={{display: user.length !== 0 ? '' : 'none'}}>{user}</span>
      </div>
      <div className={styles.top}>
        {api.subtotal.filter((data: any, index, self) => index === self.findIndex((d: any) => (d._id === data._id))).map((data: data, index: number) => {
          return(
            <div key={index} style={{textAlign: data.sender === session?.username ? 'end' : 'start'}}>
            {data.message}
            </div>
          )
        })}
      </div>
      <div className={styles.bottom}>
        <form onSubmit={onSubmit} >
        <Input placeholder="Send text" name="content"/>
        <Button btn='submit' context="Send"/>
        </form>
      </div>
    </div>
  )
}

export default Content