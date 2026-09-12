import  React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { Zustand } from '../../store'
import Input from '../../reusable/Input'
import Button from '../../reusable/Buttons'
import icon_user from '../../assets/user.png'
interface Tcontent{
  api: TSubContent;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  user: string;
  onClick: () => void;
  func: (e: string) => void
}
interface Tsubtotal{
  created_at : string
group : string
message : string 
sender : string
user_id: string
reciever: string;
__v: number
_id: string
}
interface TSubContent{
  subtotal: Tsubtotal[];
}
interface MessageData{
  message: string;
  sender: string;
  reciever: string;
  _id: string;
}
const Content = ({api, onSubmit, user, onClick, func}: Tcontent) => {
const {session} = Zustand()
const [sizer, setsizer] = useState(false)

  useEffect(()=>{
    const handleResize = () => {
    const el = document.body;
    // const container = document.getElementById('container')
    // container!.style.width = el.clientWidth - 700 + 'px'
    setsizer(el.clientWidth <= 440)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () =>{
      window.removeEventListener('resize', handleResize)
    }
  } ,[])

  return (
    <div className={styles.Content} id='Con_Container' style={{display : sizer ?  user.length !== 0 ? 'block' : 'none' : ''}} >
      <div className={styles.user} >
        <img src={icon_user} alt="user" style={{display: user.length !== 0 ? '' : 'none'}} />  <span style={{display: user.length !== 0 ? '' : 'none'}}>{user}</span>
        <button
          type="button"
          style={{display: user.length !== 0 ? '' : 'none'}}
          onClick={onClick}
        >
          Call
        </button>
        <button onClick={() => func('')} style={{display: sizer ? 'block' : 'none'}}>Back</button>
      </div>
      <div className={styles.top}>
        {api.subtotal.filter((val: MessageData, index, self) => index === self.findIndex((d: MessageData) => (d._id === val._id))).map((data: MessageData) => {
          return(
            <div key={data._id} style={{justifyContent: data.reciever === session?.username ? 'end' : 'start' }}>
              <p style={{ borderRadius: data.reciever === session?.username ? '0.5rem .5rem 0rem 0.5rem' : '0.5rem 0.5rem 0.5rem 0rem'}}>{data.message}</p>
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