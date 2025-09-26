
import './App.css'
import { Route, Routes } from 'react-router'
import Dashboard from './Pages/Dashboard/index'
import UserInfo from './Pages/UserInfo/index'
import Login from './Pages/Login/index'
import { Zustand } from './store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function App() {
  const navigate = useNavigate()
  const {session} = Zustand()

  useEffect(()=>{
    if(!session?.token){
    navigate('/login')
    }else{
      navigate('/')
    }


  },[])
  return (
    <>
      <Routes>
        <Route path='/' Component={Dashboard}></Route>
        <Route path='/user-info' Component={UserInfo}></Route>
        <Route path='/login' Component={Login}></Route>
      </Routes>
    </>
  )
}

export default App
