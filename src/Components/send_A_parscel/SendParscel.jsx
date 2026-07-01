import React from 'react';

const SendParscel = () => {
    return (
        <div>
            <div className="bg-white shadow-md p-10 mt-5 mb-10 rounded-xl">
                <h1 className='font-bold text-[45px]'>Send A Parcel</h1>
                <p className="font-bold text-[20px] my-4">Enter your parcel details</p>
                <div className="border-b border-[#000000]"></div>

                <form>
                    <div className="flex gap-10">
                        <div className="mt-3 flex gap-0.5 text-center">
                        <input type="radio" name="radio-1" className="radio text-green-500" defaultChecked  />
                        <p>Document</p>
                    </div>
                    <div className="mt-3 flex gap-0.5 text-center">
                        <input type="radio" name="radio-1" className="radio text-green-500" defaultChecked  />
                        <p>None-Document</p>
                    </div>
                    </div>
                    {/* input */}

                    <div className="mt-10 flex gap-5 justify-center">
                       <div className="l ">
                        <p className='my-1'>Parcel Name</p>
                        <input type="text" placeholder='Parcel Name' className='bg-white w-[500px] border p-2 rounded-md ' />
                       </div>
                       <div className="l ">
                        <p className='my-1'>Parcel Weight (KG) .optional </p>
                        <input type="text" placeholder='Parcel Weight (KG)' className='bg-white w-[500px] border p-2 rounded-md ' />
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
                            <p>Your District</p>
                            <input type="text" placeholder='Your District' className='rounded-md w-full border p-2' />
                            <p>Pickup Instruction</p>
                            <input type="meassge" placeholder='Pickup Instruction' className='rounded-md w-full border p-2' />

                              <p className='mt-15'>* PickUp Time 4pm-7pm Approx.</p>

                              <button className=' btn rounded-md px-10  mt-10 text-center bg-[#CAEB66]'>Proceed Confirm Booking</button>
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
                            <p>Receiver District</p>
                            <input type="text" placeholder='Receiver Dectrict' className='rounded-md w-full border p-2' />
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