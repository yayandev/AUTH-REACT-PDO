import './App.css';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Dashboard from "./layout/Dashboard";
import Login from './pages/Login';
import Register from './pages/Register';

/**
 *  TERMUX INDONESIA || RYUGENXD 2023
 */

const router = createBrowserRouter([
  {
    path: "/",
    element:(<Dashboard/>),
    errorElement:<div>404</div>,
    children:[
      {
        path:'/',
        element:(<Login/>)
      },
      {
        path:'/register',
        element:(<Register/>)
      }
    ]
  },
]);

const  App = ()=>{
  return (
    <div className="App">
     <RouterProvider router={router} />
    </div>
  );
}

export default App;
