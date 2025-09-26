import { useEffect, useState } from 'react'
import  {Zustand}  from '../../store'
import styles from './style.module.scss'
import Sidebar from '../../Component/Sidebar/index'
import Content from '../../Component/Content/index'
import { fetchApi } from '../../api/api'
interface tSidebar{
    persons: []
}
interface tContents{
    subtotal: any[]
}
const Dashboard = () => {
const { session} = Zustand();
const [sidebar, setSidebar] = useState<tSidebar>({
  persons:[]
})
const [message, setmessage] = useState<tContents>({
  subtotal: []
})
const [person, setperson] = useState<string>('')
const [notification, setnotification] = useState<string[]>([''])
interface Tmessage{
  message: string | null,
  group: string
}
const ApiSidebar = async() =>{
  fetchApi('users',{}, session?.token).then(
    res =>{
    console.log(res)
    setSidebar(res)
    })

}

const Person = (e: string) =>{
  const group = {group: e}
  setperson(e)
  fetchApi('allcomment', group, session?.token).then(
    res =>{
      console.log(res)
      setmessage(res)
    })
}

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget)
    //console.log(formdata.get("content"), person)
    Websocket(formdata.get("content") as string, person)
  //const ws = Websocket(formdata.get("content") as string, person); // capture socket

    //ws?.close(); // close when component unmounts
  
  }

const Websocket = (message?: string, group?: string) =>{
  console.log('went in')
  const websocket = new WebSocket('ws://localhost:8080', session?.token)
  const text: Tmessage =  {
    message: message as string,
    group: group as string
  }
  console.log(message, group)
  websocket.onopen = () =>{
    console.log('connected')
    if(message !== undefined){
      websocket.send(JSON.stringify(text))

    }
    websocket.onmessage = (e) => {
    console.log(e.data)
    const data =  JSON.parse(e.data)
    console.log(data.group === `${person}, ${session?.username}` || data.group === `${session?.username}, ${person}`, `${session?.username}, ${person}`)
    if(data.group === `${person}, ${session?.username}` || data.group === `${session?.username}, ${person}`){
    setmessage(prev => ({ subtotal: [...prev.subtotal, data] }))
    }else{
      const value = [...notification  , data.sender as string]
      
      setnotification(value)
    }
  }
  
  }
  return websocket
}
const resetNotif = () => {
  console.log('here')
  setnotification([])
}
useEffect(()=>{
    ApiSidebar();
    console.log('here')
  const ws = Websocket(); // capture socket
  return () => {
    ws?.close(); // close when component unmounts
  }
},[person])
useEffect(()=>{
  const handleResize = () => {
  const el = document.body;
  const container = document.getElementById('container')
  container!.style.width = el.clientWidth - 72 + 'px'
  console.log(el.clientWidth)
  }

  handleResize()

  window.addEventListener('resize', handleResize)
  return () =>{
    window.removeEventListener('resize', handleResize)
  }
} ,[])


    return (
    <div className={styles.container} id='container'>
      <Sidebar api={sidebar} func={Person} notification={notification} resetNotif={resetNotif} token={session?.token} active={person}/>
      <Content api={message} onSubmit={onSubmit} user={person}/>
    </div>
  )
}

export default Dashboard