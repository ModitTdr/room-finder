const Button = (props) => {

  return (
    <button 
      className={`cursor-pointer px-6 py-2 rounded-lg font-bold ${props.bgcolor || 'bg-text'} ${props.textcolor || 'text-background'}`}>
        {props.children}
    </button>
  )
}

export default Button