import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth/useAuth";
import UseaxiosSecure from "../../../Hooks/useAxios/useaxiosSecure";
import { FaEdit, FaRupeeSign } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosSecure();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: Boolean(user?.email),
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

//    Handeling ==>
    const parcelhandelDelete = (id)=>{
    //Aleat section =>
   Swal.fire({
    
  title: "Are you sure to delete this?",
  text: "You want to be delete this item !",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"

  
}).then((result) => {
       
    if(result.isConfirmed){
          axiosSecure.delete(`/parcels/${id}`)
    .then(res=>{
       if(res.data.deletedCount){
        
        Swal.fire({   
    title: "Deleted!",
    text: "Your item has been deleted.",
    icon: "success"
  });
  refetch()
  
       }
        console.log(res)
    })
    }
});
        // sweet  alete<===>

        
    
        console.log(id , "delete items")


    }





  return (
    <div className="px-2">
      <h2 className="text-5xl my-10 font-semibold ">
        {" "}
        All my parcels : {parcels.length}
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Parcel Name</th>
              <th>Parcel Type</th>
              <th>Payment </th>
              <th className="flex items-center gap-2">
                Parcel cost{" "}
                <span>
                  <FaRupeeSign />
                </span>
              </th>
               <th>Actions</th>
                <th>Delevery status</th>
            </tr>
          </thead>
          <tbody className="">
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td className="text-xl">{parcel.parcelName}</td>
                <td className="text-xl">{parcel.parceltype}</td>
                {/* Pyment */}
                <td className="text-xl">
                  {parcel.paymentStatus === "paid" ? (
                    <span className="text-green-500">Paid</span>
                  ) : (
                    <>
                      <span className="text-red-500"> payment Panding </span>
                      <Link to={`/dashbord/payment/${parcel._id}`}>
                        <button className="btn bg-amber-400 shadow-none btn-sm">
                          Pay-now
                        </button>
                      </Link>
                    </>
                  )}
                </td>
                {/* cost */}

                <td className="flex items-center gap-2 text-xl">
                  {parcel.cost}
                  <span>
                    <FaRupeeSign />
                  </span>
                </td>
               
                  
                {/* actions */}
                <td className="px-2 ">
                  <button className="btn btn-square mx-2 items-center border-none bg-none shadow-none text-xl">
                    <FaEdit />
                  </button>

                  <button className="btn btn-square mx-2 items-center border-none bg-none shadow-none text-xl">
                  <IoIosSearch />
                  </button>

                  <button onClick={()=>parcelhandelDelete (parcel._id) } className="btn btn-square mx-2 items-center border-none bg-none shadow-none text-xl">
                  <MdDeleteForever />
                  </button>
                  
                   
                </td>

                <td className="flex items-center gap-2 text-xl">
                  {parcel.deliveryStatus}
                  
                  <span>
                   <FaRupeeSign />
                    
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
