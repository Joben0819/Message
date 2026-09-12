import React, {  useState } from 'react'
import {fetchApi} from '../../api/api'
import { Zustand } from '../../store'
import styles from './style.module.scss'
const Login = () => {
  const {setsession} = Zustand()
  const [register, setregister] = useState<boolean>(false)
  const OnSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = Number(form.get("password"))
    const username = form.get("username")
    alert(password)
      if(password){
        const data = {
            username: username,
            password: password
        }
        alert('has passwords')
        fetchApi(register ? 'register' : 'login', data).then((res) => {
          if(res.status === 200){
            alert('went in')
          setsession(res); 
          window.location.pathname = '/'
          }
        })
      }else{
        alert('went out')
        alert('password must be number and username must be text')
      }

    // })

  }
    return (
    <>
    <div className={styles.card}>
      <h2>Chat Application</h2>
      <form onSubmit={OnSubmit}>
        <input type='text' name="username" placeholder={register ? 'Create Username' : 'Username'} />
        <input type="text" name='password' placeholder={register ? 'Create Password' : 'Password'} />
        <div className={styles.btn_group}>
          <button type="submit" className={styles.btn_submit} >Submit</button>
          <button type="button" className={styles.btn_submit} id='register' onClick={() => setregister(prev => !prev)}>{register ? 'Login' : 'Register'}</button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Login