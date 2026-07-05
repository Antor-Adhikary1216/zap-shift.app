import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth/useAuth";
import UseaxiosSecure from "../../../Hooks/useAxios/useaxiosSecure";
import { FaEdit, FaRupeeSign } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosSecure();

  const { data: parcels = [] } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

//    Handeling ==>
    const parcelhandelDelete = (id)=>{
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
              <th>Payment Status</th>
              <th className="flex items-center gap-2">
                Parcel cost{" "}
                <span>
                  <FaRupeeSign />
                </span>
              </th>
               <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td className="text-xl">{parcel.parcelName}</td>
                <td className="text-xl">{parcel.parceltype}</td>
                <td className="text-xl">Panding</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
