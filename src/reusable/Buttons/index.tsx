import React from 'react'
interface Ttype{
    btn: string;
    context: string
}
const Button = ({btn, context}: Ttype) => {
    const typebtn = btn ?? "submit"
  return (
    <button type={typebtn}> {context}</button>
  )
}

export default Button