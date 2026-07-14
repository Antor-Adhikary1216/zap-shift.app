import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth/useAuth";
import UseaxiosSecure from "../../../Hooks/useAxios/useaxiosSecure";
import { FaEdit, FaRupeeSign } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import Swal from "sweetalert2";
import { Link, Navigate } from "react-router";
import useUserRole from "../../../Hooks/useUserRole/useUserRole";
import DashboardLoader from "../../../Components/LoadingIndicator/DashboardLoader";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosSecure();
  const { isAdmin, isRoleLoading } = useUserRole();

  const { data: parcels = [], refetch, isLoading: isParcelsLoading } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: Boolean(user?.email) && !isRoleLoading && !isAdmin,
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels');
      return res.data;
    },
  });

  const sortedParcels = [...parcels].sort((firstParcel, secondParcel) => {
    const firstIsPaid = firstParcel.paymentStatus === "paid";
    const secondIsPaid = secondParcel.paymentStatus === "paid";
    return Number(firstIsPaid) - Number(secondIsPaid);
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
    })
    }
});
        // sweet  alete<===>

        
    
    }


  if (isRoleLoading || isParcelsLoading) {
    return <DashboardLoader message="Loading your parcels..." />;
  }

  if (isAdmin) {
    return <Navigate to="/dashbord/admin-parcels" replace />;
  }





  return (
    <main className="min-w-0 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="my-5 text-2xl font-semibold text-[#03373D] sm:my-10 sm:text-5xl">
          All my parcels: {parcels.length}
        </h2>

        {sortedParcels.length === 0 && (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center sm:p-10">
            <p className="text-lg font-semibold text-[#03373D]">No parcels found</p>
            <p className="mt-2 text-sm text-base-content/60">Parcels you send will appear here.</p>
          </div>
        )}

        <div className="space-y-4 md:hidden">
          {sortedParcels.map((parcel, index) => (
            <article key={parcel._id} className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Parcel {index + 1}</p>
                  <h3 className="mt-1 truncate text-lg font-bold text-[#03373D]">{parcel.parcelName || 'Unnamed parcel'}</h3>
                  <p className="text-sm capitalize text-base-content/60">{parcel.parceltype || 'Parcel delivery'}</p>
                </div>
                <span className={`badge shrink-0 whitespace-nowrap ${parcel.paymentStatus === "paid" ? "badge-success badge-outline" : "badge-warning badge-outline"}`}>
                  {parcel.paymentStatus === "paid" ? "Paid" : "Payment pending"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-base-200/70 p-3">
                <div>
                  <p className="text-xs text-base-content/50">Parcel cost</p>
                  <p className="flex items-center gap-1 font-bold text-[#03373D]">{parcel.cost}<FaRupeeSign className="text-sm" /></p>
                </div>
                <div>
                  <p className="text-xs text-base-content/50">Delivery status</p>
                  <p className="font-semibold text-[#03373D]">{parcel.paymentStatus === "paid" ? "Parcel Shipped" : "Pay Fast"}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 min-[390px]:grid-cols-2">
                {parcel.paymentStatus !== "paid" && (
                  <Link to={`/dashbord/payment/${parcel._id}`} className="btn min-h-11 border-0 bg-amber-400 text-[#03373D] shadow-none hover:bg-amber-500">
                    Pay now
                  </Link>
                )}
                {parcel.paymentStatus === "paid" && parcel.trackingId && (
                  <Link
                    to={`/dashbord/track-parcel?trackingId=${encodeURIComponent(parcel.trackingId)}`}
                    className="btn min-h-11 border-0 bg-[#CAEB66] text-[#03373D]"
                  >
                    Track parcel
                  </Link>
                )}
                {parcel.paymentStatus !== "paid" && (
                  <button
                    type="button"
                    onClick={() => parcelhandelDelete(parcel._id)}
                    className="btn min-h-11 border-red-200 bg-red-50 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white"
                    aria-label={`Delete ${parcel.parcelName || "parcel"}`}
                  >
                    <MdDeleteForever className="text-xl" /> Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {sortedParcels.length > 0 && (
          <div className="hidden max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-base-300 bg-base-100 md:block">
            <table className="table min-w-max">
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
            {sortedParcels.map((parcel, index) => (
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

                  {parcel.paymentStatus === "paid" && parcel.trackingId && (
                    <Link
                      to={`/dashbord/track-parcel?trackingId=${encodeURIComponent(parcel.trackingId)}`}
                      className="btn btn-sm border-0 bg-[#CAEB66] text-[#03373D]"
                    >
                      Track
                    </Link>
                  )}

                  {parcel.paymentStatus !== "paid" && (
                    <button
                      onClick={() => parcelhandelDelete(parcel._id)}
                      className="btn btn-square mx-2 items-center border-none bg-none shadow-none text-xl"
                      aria-label={`Delete ${parcel.parcelName || "parcel"}`}
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                  
                   
                </td>

                <td>
                  {parcel.paymentStatus === "paid" ? (
                    <span className="badge badge-success badge-outline whitespace-nowrap">
                      Parcel Shipped
                    </span>
                  ) : (
                    <span className="badge badge-warning badge-outline whitespace-nowrap">
                      Pay Fast
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyParcels;
