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
import Register from "../Components/Register/Register";
import Login from "../Components/Login/Login";


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
        path:"login",
        Component: Login
    },
    {
        path:'Register',
        Component:Register
    }
])
