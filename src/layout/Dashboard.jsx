import { Outlet } from "react-router-dom";
import logo from "../logo.svg";
import "../styles/dashboard.scss";
import Navbar from "../components/Navbar";
const Dashboard = ()=>{
    return (
        <div className="auth">
            <Navbar/>
            <div className="auth-logo">
                <img src={logo} width="200" alt="logo"/>
            </div>
            <div className="content">
                <Outlet/>
            </div>
            <div className="footer">
                
            </div>
        </div>
    )
}

export default Dashboard;