import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { fetchApi } from '../../api/api'
import icon_user from '../../assets/user.png'
import { data } from 'react-router'

interface Tsidebar{
    api: Contents
    func: (e:string) => void,
    notification: string[],
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
const Sidebar = ({api, func, notification,resetNotif, token, active}: Tsidebar) => {
    const [search, setsearch] = useState<string>('')
    const [value, setvalue] = useState<[]>([])
    useEffect(()=>{

    },[notification])
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
  return (
    <div className={styles.sidebar}>
        <div className={styles.search}>
            <input type="text" placeholder='Search People' onChange={(e) => setsearch(e.target.value)}/>
            <button onClick={onSearch}>Search</button>
        </div>
        <div className={styles.lists}>
            {value.map((data: data, index: number) => {
                return(
                    <div key={index} className={styles.card} onClick={() => {func(data.username)}} style={{cursor: 'pointer'}}> <img src={icon_user} alt="user" /> <span>{data.username}</span></div>
                )       
            })}
        </div>
        {Object.keys(api).length !== 0 && api.persons.map((data: data, index:number) => {
            return(
                
                <div key={index} className={styles.card} onClick={() => {func(data.username); resetNotif()}} style={{color: notification.find((val: string) => val === data.username ) ? 'red' : '', backgroundColor: active === data.username ? 'grey' : ''}}> <img src={icon_user} alt="user" /> <span>{data.username}</span></div>
                
            )
        })}
    </div>
  )
}

export default Sidebar