import { createBrowserRouter } from "react-router";
import App from "../App";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import Coverags from "../Components/Coverage/Coverags";
import Services from "../Components/Services/Services";
import AboutUS from "../Components/AboutUS/AboutUS";
import Bargainnig from "../Components/Bargainnig/Bargainnig"
import BeaRider from "../Components/BeaRider/BeaRider";
import AuthLaout from "../Layout/AuthLaoyut/AuthLaout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";



export const router = createBrowserRouter([
    {
        path:"/",
        element:<RootLayout/>,
        children:[
            {
                index: true,
                Component: Home
            },
            {
                path:"Coverags",
                Component: Coverags,
                loader: ()=> fetch("/Resoin.json")
                .then(res=>res.json())
            },
            {
                path:'services',
                Component: Services
            },
            {
                path:"aboutUs",
                Component: AboutUS
            },
            {
                path:"bargainnig",
                Component: Bargainnig
            },
            {
                path:"bearider",
                Component: BeaRider
            }
        ]
        
    }
    ,
    {
         path:"/",
         Component: AuthLaout,
         children:[
            {
                path:"login",
                Component:Login
            },
            {
                path:"register",
                Component:Register
            }
         ]
    }

])
