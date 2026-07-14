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
import TrackParcel from "../Pages/TrackParcel/TrackParcel";
import ForgotPassword from "../Pages/Authentication/ForgotPassword/ForgotPassword";
import ApprovedRider from "../Layout/Dashbord/ApprovedRider/ApprovedRider";
import UserManagement from "../Layout/Dashbord/UserManagement/UserManagement";
import AdminRoute from "./AdminRoute";
import AdminPaymentHistory from "../Layout/Dashbord/AdminPaymentHistory/AdminPaymentHistory";
import AdminParcels from "../Layout/Dashbord/AdminParcels/AdminParcels";
import AccountSettings from "../Layout/Dashbord/AccountSettings/AccountSettings";
import UserRoute from "./UserRoute";
import DashboardHome from "./DashboardHome";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";



export const router = createBrowserRouter([
    {
        path:"/",
        element:<RootLayout/>,
        errorElement:<ErrorPage />,
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
                path:"bearider",
                element:<PrivetRoute><BeaRider /></PrivetRoute>
            },
            {
                path:"/send_a_parcel",
                element: <PrivetRoute><SendParscel /></PrivetRoute>,
                loader: ()=> fetch("/Resoin.json").then(res=>res.json())
            }
        ]
        
    }
    ,
    {
         path:"/",
         Component: AuthLaout,
         errorElement:<ErrorPage />,
         children:[
            {
                path:"login",
                Component:Login
            },
            {
                path:"register",
                Component:Register
            },
            {
                path:"forgot-password",
                Component:ForgotPassword
            }
         ]
    },
    {
        path:"dashbord",
        element: <PrivetRoute><Dashlayout /></PrivetRoute>,
        errorElement:<ErrorPage />,
        children:[
            {
                index: true,
                Component: DashboardHome
            },
            {
                path:'account-settings',
                element: <UserRoute><AccountSettings /></UserRoute>
            },
            {
                path:'track-parcel',
                Component: TrackParcel
            },
            {
                path:'my-parcels',
                element: <UserRoute><MyParcels /></UserRoute>
            },
            {
                path:'payment-history',
                element: <UserRoute><PaymentHistory /></UserRoute>
            },
            {
                path:'admin-parcels',
                element: <AdminRoute><AdminParcels /></AdminRoute>
            },
            {
                path:'admin-payment-history',
                element: <AdminRoute><AdminPaymentHistory /></AdminRoute>
            },
            {
                path:'approved-rider',
                element: <AdminRoute><ApprovedRider /></AdminRoute>
            },
            {
                path:'user-management',
                element: <AdminRoute><UserManagement /></AdminRoute>
            },
            {
                path:'coverage',
                element: <AdminRoute><Coverags /></AdminRoute>,
                loader: () => fetch('/Resoin.json').then((res) => res.json())
            },
            {
                path:"payment/:parcelId",
                element: <UserRoute><PayNow /></UserRoute>,
            },
            {
                path:"payment-successful",
                element: <UserRoute><Payment_success /></UserRoute>
            },
            {
                path:"payment-canceld",
                element: <UserRoute><Payment_Canceld /></UserRoute>
            },
            {
                path:"pending-parcel/:parcelId",
                element: <UserRoute><PendingParcel /></UserRoute>
            }
        ]
    },
    {
        path:"*",
        element:<ErrorPage />
    }

])
