import styles from './style.module.scss'
interface Tinput{
    placeholder: string;
    name: string
}
const Input = ({placeholder, name}: Tinput) => {
  return (
    <input type="text" className={styles.input} placeholder={placeholder} name={name}/>
  )
}

export default Input