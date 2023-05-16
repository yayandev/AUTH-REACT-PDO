import { Link } from "react-router-dom";
import "../styles/navbar.scss";
const links = [
    {
        path:'/',
        name:'login'
    },
    {
        path:'/register',
        name:'register'
    }
];
const Navbar = ()=>{
    return (
        <div className="navbar">
            <ul className="nav-items">
                {
                    links.map((link,index)=>(
                        <li key={index} className="nav-item">
                            <Link className="nav-link" to={link.path}>{link.name}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Navbar;