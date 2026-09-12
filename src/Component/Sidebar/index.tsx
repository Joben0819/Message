import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { fetchApi } from '../../api/api'
import icon_user from '../../assets/user.png'
import { data } from 'react-router'
import Input from '../../reusable/Input'
import Button from '../../reusable/Buttons'
import { Zustand } from '../../store'

interface Tsidebar{
    api: Contents
    func: (e:string) => void,
    notification: Tmessage[],
    resetNotif: () => void,
    token?: string,
    active?: string
}
interface Contents{
    persons: []
}
interface data{
    username: string
}
interface Tmessage{
    sender: string
    reciever: string
}
const Sidebar = ({api, func, notification, resetNotif, token, active}: Tsidebar) => {
    const [search, setsearch] = useState<string>('')
    const [value, setvalue] = useState<[]>([])
    const [user, setuser] = useState<{[n:string]: string}>({})
    const [sizer, setsizer] = useState(false)
    const sessional = Zustand((state) => state.session)

    useEffect(()=>{
        const obj: {[n:string]: string} = {}
        api.persons.forEach((element: data) => {
            // console.log(element, 'element')
            obj[element.username] = element.username
        });
        // console.log( notification, 'dsdsd',obj,user, api )
        // const result = new Set(Object.values(obj));

        setuser(obj)
    },[notification, api])
    const onSearch = () =>{
        if(search === ''){ 
            alert('No CONTEXT')
        }else{
            fetchApi('searchuser', {username: search}, token).then(res =>{
                console.log(res.persons)
                setvalue(res.persons)
            })
        }

    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setsearch(e.target.value)
    }
    useEffect(() =>{
        const valueated = notification.filter((val) => user[val.sender] !== val.sender)
        console.log(valueated, 'evaluated', user, notification)
    },[user,value])

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
    <div className={styles.sidebar} style={{display: sizer ? active?.length === 0 ? 'block' : 'none' : 'block'}}>
        <div className={styles.search}>
            <Input placeholder="Search People" onchange={onChange}  name=""/>
            <Button btn='submit' context="Search" onClick={onSearch}/>
        </div>
        <div className={styles.lists}>
            {value.map((person: data) => {
                return(
                    <button
                        key={person.username}
                        type="button"
                        className={styles.card}
                        onClick={() => { func(person.username); setTimeout(() =>{setvalue([])},200);}}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                func(person.username);
                                setTimeout(() =>{setvalue([])},200);
                            }
                        }}
                        style={{cursor: 'pointer'}}
                    >
                        <img src={icon_user} alt="" />
                        <span>{person.username}</span>
                    </button>
                )       
            })}
        </div>
        
        {Object.keys(api).length !== 0 && api.persons.map((person: data) => {
            const hasNotification = notification.some((val) => val.sender === person.username);
            return(
                <button
                    key={person.username}
                    type="button"
                    className={styles.card}
                    onClick={() => {
                        func(person.username); 
                        resetNotif()
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            func(person.username);
                            resetNotif();
                        }
                    }}
                    style={{
                        color: hasNotification ? 'red' : '', 
                        backgroundColor: active === person.username ? 'grey' : ''
                    }}
                > 
                    <img src={icon_user} alt="" /> 
                    <span>{person.username}</span>
                </button>
            )
        })}
        {
            notification.map((data) =>{
                if(sessional?.username === data?.reciever){
                    return(
                        <button
                            key={`${data.sender}-${data.reciever}`}
                            type="button"
                            className={styles.card}
                            onClick={()=>{func(data.sender); resetNotif()}}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    func(data.sender);
                                    resetNotif();
                                }
                            }}
                        >
                            New Message {data.sender}
                        </button>
                    )
                }
                return null;

            })
        }
    </div>
  )
}

export default Sidebar