import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import PrivetRoute from "./PrivetRoute";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import DashboardHome from "./DashboardHome";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import {
    AccountSettings,
    AdminParcels,
    AdminPaymentHistory,
    ApprovedRider,
    AuthLaout,
    Bargainnig,
    BeaRider,
    Coverags,
    Dashlayout,
    ForgotPassword,
    Login,
    MyParcels,
    PayNow,
    Payment_Canceld,
    Payment_success,
    PaymentHistory,
    PendingParcel,
    Register,
    SendParscel,
    Services,
    AboutUS,
    TrackParcel,
    UserManagement,
} from "./LazyRoutes";



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
