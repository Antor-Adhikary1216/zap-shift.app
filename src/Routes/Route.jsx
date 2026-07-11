import { createBrowserRouter } from "react-router";
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
import SendParscel from "../Components/send_A_parscel/SendParscel";
import Dashlayout from "../Layout/Dashbord/Dashlayout";
import MyParcels from "../Layout/Dashbord/MyParcels/MyParcels";
import PayNow from "../Layout/Dashbord/Payment/PayNow";
import Payment_success from "../Layout/Dashbord/Payment/Payment_Success/Payment_success";
import Payment_Canceld from "../Layout/Dashbord/Payment/Payment_Cancel/Payment_Canceld";
import PendingParcel from "../Layout/Dashbord/PendingParcel/PendingParcel";
import PaymentHistory from "../Layout/Dashbord/PaymentHistory/PaymentHistory";
import PrivetRoute from "./PrivetRoute";



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
                element: <PrivetRoute><Coverags /></PrivetRoute>,
                loader: ()=> fetch("/Resoin.json")
                .then(res=>res.json())
            },
            {
                path:'services',
                element: <PrivetRoute><Services /></PrivetRoute>
            },
            {
                path:"aboutUs",
                element: <PrivetRoute><AboutUS /></PrivetRoute>
            },
            {
                path:"bargainnig",
                element: <PrivetRoute><Bargainnig /></PrivetRoute>
            },
            {
                    path:"/send_a_parcel",
                    element: <PrivetRoute><SendParscel /></PrivetRoute>,
                    loader: ()=> fetch("/Resoin.json")
                .then(res=>res.json())
            },
            {
                path:"bearider",
                element:<BeaRider/>
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
    },
    {
        path:"dashbord",
        element: <PrivetRoute><Dashlayout /></PrivetRoute>,
        children:[
            {
                path:'my-parcels',
                Component: MyParcels
            },
            {
                path:'payment-history',
                Component: PaymentHistory
            },
            {
                path:"payment/:parcelId",
                Component: PayNow,
            },
            {
                path:"payment-successful",
                Component: Payment_success
            },
            {
                path:"payment-canceld",
                Component:Payment_Canceld
            },
            {
                path:"pending-parcel/:parcelId",
                Component: PendingParcel
            }
        ]
    }

])
