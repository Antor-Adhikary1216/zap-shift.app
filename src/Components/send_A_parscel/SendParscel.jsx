import React from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';

const SendParscel = () => {
const {register, handleSubmit, watch, formState:{errors}} = useForm()
const senter = useLoaderData()
 const regionsDuplicate = senter.map(reson => reson.region)
 const regios = [...new Set(regionsDuplicate)]
 const senderwatch = watch("senderwatch")

 const districtsByregions =region=>{
 const distrctsregions = senter.filter(c=>c.region===region)
 const districts = distrctsregions.map(d =>d.district)
 return districts
 }
 


const handlesendParcel = (data)=>{
    console.log(data)
}

     
    return (
        <div>
            <div className="bg-white shadow-md p-10 mt-5 mb-10 rounded-xl">
                <h1 className='font-bold text-[45px]'>Send A Parcel</h1>
                <p className="font-bold text-[20px] my-4">Enter your parcel details</p>
                <div className="border-b border-[#000000]"></div>

                <form onSubmit={handleSubmit(handlesendParcel)}>
                    <div className="flex gap-10">
                        <div className="mt-3 flex gap-0.5 text-center">
                        <input type="radio" {...register("parceltype")} value="document" className="radio text-green-500" defaultChecked  />
                        <p>Document</p>
                    </div>
                    <div className="mt-3 flex gap-0.5 text-center">
                        <input type="radio" {...register("parceltype")} value="none-documet" className="radio text-green-500"   />
                        <p>None-Document</p>
                    </div>
                    </div>
                    {/* input */}

                    <div className="mt-10 flex gap-5 justify-center">
                       <div className="l ">
                        <p className='my-1'>Parcel Name</p>
                        <input type="text" {...register("parcelName")} placeholder='Parcel Name' className='bg-white w-[500px] border p-2 rounded-md ' />
                       </div>
                       <div className="l ">
                        <p className='my-1'>Parcel Weight (KG)  </p>
                        <input type="text" {...register("parcelWeight")} placeholder='Parcel Weight (KG)' className='bg-white w-[500px] border p-2 rounded-md ' />
                       </div>
                    </div>

                            <div className="border-b w-[1000px] mx-auto border-[#000000] my-10"></div>
                        {/*  sendder -> */}
                        <div className=" justify-center mt-16 flex gap-5">
                            <div className="w-[500px]">
                            <h1 className='text-[20px] font-medium '>Sender Details</h1>
                            <p>Sender Name</p>
                            <input type="text" placeholder='Sender Name' className='rounded-md w-full border p-2' />
                            <p>Sender Address</p>
                            <input type="text" placeholder='Sender Address' className='rounded-md w-full border p-2' />
                            <p>Sender Phone No</p>
                            <input type="text" placeholder='Sender Phone No' className='rounded-md w-full border p-2' />
                            {/*  pic a regoin -> */}
                            <p>Your Regions</p>
                           <select {...register("senderwatch")} defaultValue="Select your location" className="select select-accent w-full">
                         <option disabled={true}>Select your location</option>
                         {
                             regios.map((r,i)=> <option key={i} value={r}>{r}</option>)
                         }
                           </select>

                           {/* dectricts */}
                           <p>Your Destrict</p>
                             <select {...register("senderDestricts")} defaultValue="Select your location" className="select select-accent w-full">
                         <option disabled={true}>Select your location</option>
                         {
                             districtsByregions(senderwatch).map((r,i)=> <option key={i} value={r}>{r}</option>)
                         }
                           </select>
                           
                            {/* picup instruction  */}
                            <p>picup Instruction</p>
                            <input type="text" placeholder='Delivery Instruction ' className='rounded-md w-full border p-2' />
                              <p className='mt-15'>* PickUp Time 4pm-7pm Approx.</p>

                             <input type="submit" value="send parcel" className='btn' />
                        </div>
                       
                        {/* Receiver Details */}
                        <div className="R w-[500px]">
                            <h1 className='text-[20px] font-medium '>Receiver Details</h1>
                            <p>Receiver Name</p>
                            <input type="text" placeholder='Receiver Name' className='rounded-md w-full border p-2' />
                            <p>Receiver Address</p>
                            <input type="text" placeholder='Address' className='rounded-md w-full border p-2' />
                            <p>Receiver Contact No:</p>
                            <input type="text" placeholder='Receiver No' className='rounded-md w-full border p-2' />
                           {/*  pic a regoin -> */}
                            <p>Reciver Regions</p>
                           <select {...register("senderwatch")} defaultValue="Select your location" className="select select-accent w-full">
                         <option disabled={true}>Select your location</option>
                         {
                             regios.map((r,i)=> <option key={i} value={r}>{r}</option>)
                         }
                           </select>

                           {/* dectricts */}
                           <p>Receiver Destrict</p>
                             <select {...register("senderDestricts")} defaultValue="Select your location" className="select select-accent w-full">
                         <option disabled={true}>Select your location</option>
                         {
                             districtsByregions(senderwatch).map((r,i)=> <option key={i} value={r}>{r}</option>)
                         }
                           </select>
                            <p>Delivery Instruction</p>
                            <input type="text" placeholder='Delivery Instruction ' className='rounded-md w-full border p-2' />

                        </div>
                        </div>
                </form>

            </div>
        </div>
    );
};

export default SendParscel;