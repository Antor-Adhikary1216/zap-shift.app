import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth/useAuth";
import UseaxiosSecure from "../../../Hooks/useAxios/useaxiosSecure";
import { FaRupeeSign } from "react-icons/fa";

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

  return (
    <div className="px-3">
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
              <th>Actions</th>
              <th className="flex items-center gap-2">Parcel cost <span><FaRupeeSign /></span></th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>{parcel.parceltype}</td>
                <td>Panding</td>
                  <td>Delete </td>
                <td className="flex items-center gap-2">{parcel.cost} <span><FaRupeeSign /></span></td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
