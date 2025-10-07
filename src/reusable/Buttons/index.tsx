
interface Ttype{
    btn: "submit" | "reset" | "button";
    context: string;
    onClick?: () => void;
}
const Button = ({btn = "submit", context, onClick}: Ttype) => {
    //const typebtn = btn ?? "submit"
  return (
    <button type={btn} onClick={onClick}> {context}</button>
  )
}

export default Button