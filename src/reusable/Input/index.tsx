import styles from './style.module.scss'
interface Tinput{
    placeholder: string;
    name: string;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({placeholder, name, onchange}: Tinput) => {
  return (
    <input type="text" className={styles.input} placeholder={placeholder} name={name} onChange={onchange}/>
  )
}

export default Input