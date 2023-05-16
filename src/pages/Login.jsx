import "../styles/login.scss";
import axios from "axios";
import { ApiUrl,APIKEY } from "../config/Api";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import "../styles/login.scss";
const Login = ()=>{
    const [pass,setPass] = useState("");
    const [email,setEmail] = useState("");
    const [noEmail,setNoEmail] = useState(false);
    const [noPass,setNoPass] = useState(false);
    const [showAlert,setShowAlert] = useState(false);
    const [statusColor,setStatusColor] = useState("red");
    const [message,setMessage] = useState("");
    const [load,setLoad] = useState(false);
    /*
     * Di project ini saya memiliki banyak pengalaman
     * baru di nodejs  dan ini masi langkah awal menuju 
     * fullstack web developer yang profesional dalam
     * berbagai macam bidang. 
     */
    const loginHandler = async ()=>{
        if(email.length === 0){
            setStatusColor("#FFD95A");
            setMessage("Email tidak boleh kosong !");
            setNoPass(false);
            setNoEmail(true);
            setShowAlert(true);
            // alert("email tidak boleh kosong")
        }else if(pass.length < 4){
            setNoEmail(false);
            setShowAlert(true);
            setStatusColor("#FFD95A");
            setMessage("Password minimal 4 karakter !");
            setNoPass(true);
            // alert("password minimal 4 karakter")
        }else{
            setNoEmail(false);
            setNoPass(false);
            if(!load){
                setLoad(true);
                try{
                    setStatusColor("#FFD95A");
                    setMessage("Loading....!");
                    setShowAlert(true);
                    let data = new FormData();
                    data.append("email",email);
                    data.append("pass",pass);
                    data.append("API_KEY",APIKEY);
                    data.append("login",true);
                    await axios.post(ApiUrl,data).then((respon)=>{
                        const res = respon.data;
                        setLoad(false);
                        if(res.status){
                            setShowAlert(true);
                            setStatusColor("#03C988");
                            setMessage("Berhasil Login !");
                        }else{
                            setShowAlert(true);
                            setStatusColor("red");
                            setMessage("Login Gagal !");
                        }
                    }).catch((err)=>{
                        console.error(err);
                    })
                }catch(err){
                    console.error(err);
                }
            }
        }
    }
    useEffect(()=>{
        if(showAlert){
            const timer = setTimeout(()=>setShowAlert(false),3000);
            return () => clearTimeout(timer);
        }
    },[showAlert,setShowAlert,]);
    return (
        <div className="login">
             <Alert hide={showAlert} bg={statusColor} text={message}/>
            <div className="col-login" style={{border:noEmail?'1px solid red':'none'}}>
                <input placeholder="email..." type="email" onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="col-login" style={{border:noPass?'1px solid red':'none'}}>
                <input placeholder="password..." type="password" onChange={(e)=>setPass(e.target.value)}/>
            </div>
            <div className="col-login">
                <button onClick={loginHandler}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login;