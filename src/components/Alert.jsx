import "../styles/alert.scss";
const Alert = ({hide,bg,text="message"})=>{
    return (
        <div className="alert" style={{border:`1px solid ${bg}`,display:hide?'block':'none'}}>
            <div className="alert-message">
                {text}
            </div>
        </div>
    )
}

export default Alert;