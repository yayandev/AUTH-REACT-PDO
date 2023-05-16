import {useState} from "react";
import axios from "axios";
import { ApiUrl,APIKEY } from "../config/Api";
import Alert from "../components/Alert";
import "../styles/register.scss";
import { useEffect } from "react";
const Register = ()=>{
    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("");
    const [cpass,setCpass] = useState("");
    const [emailIsReady,setEmailIsReady] = useState(true);
    const [passIsReady,setPassIsReady] = useState(true);
    const [cpassIsReady,setCpassIsReady] = useState(true);
    const [message,setMessage] = useState("");
    const [showAlert,setShowAlert] = useState(false);
    const [statusColor,setStatusColor] = useState("red");
    const [load,setLoad] = useState(false);
    const handlerRegister = async ()=>{
        if(email.length === 0){
            setPassIsReady(true);
            setEmailIsReady(false);
            setStatusColor("#FFD95A");
            setMessage("Email tidak boleh kosong !");
            setShowAlert(true);
            // alert("email tidak boleh kosong");
        }else if(pass.length<4){
            setEmailIsReady(true);
            setPassIsReady(false);
            setStatusColor("#FFD95A");
            setMessage("Password minimal 4 karakter !");
            setShowAlert(true);
            // alert("password minimal 4 karakter");
        }
        else if(pass !== cpass){
            setEmailIsReady(true);
            setPassIsReady(true);
            setStatusColor("#FFD95A");
            setMessage("Konfirmasi password gagal !");
            setShowAlert(true);
            setCpassIsReady(false);
            // alert("konfirmasi password salah");
        }else{
            if(!load){
                setLoad(true);
                let data = new FormData();
                data.append('email',email);
                data.append('pass',pass);
                data.append('API_KEY',APIKEY);
                data.append('register',true);
                await axios.post(ApiUrl,data)
                .then((respon)=>{
                    let result = respon.data;
                    setLoad(false);
                    if(result.status){
                        setShowAlert(true);
                        setStatusColor("#03C988");
                        setMessage("Akun Berhasil Di Buat !");
                    }else{
                        setShowAlert(true);
                        setStatusColor("red");
                        setMessage("Akun Gagal Di Buat !");
                    }
                }).catch((err)=>{
                    console.log(err);
                });
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
        <div className="register">
            <Alert hide={showAlert} bg={statusColor} text={message}/>
            <div className="col-register" style={{border:emailIsReady?'none':'1px solid red'}}>
                <input placeholder="email..." type="email" onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="col-register" style={{border:passIsReady?'none':'1px solid red'}}>
                <input placeholder="password..." type="password" onChange={(e)=>setPass(e.target.value)}/>
            </div>
            <div style={{border:cpassIsReady?'none':'1px solid red'}} className="col-register">
                <input placeholder="confirm password..." type="password" onChange={(e)=>setCpass(e.target.value)}/>
            </div>
            <div className="col-register">
                <button className="bnt-register" onClick={handlerRegister}>
                   BUAT AKUN
                </button>
            </div>
        </div>
    )
}

export default Register;