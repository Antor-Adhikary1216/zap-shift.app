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
                        <input type="text" placeholder='name' className='bg-white w-[500px] border p-2 rounded-md ' />
                       </div>
                       <div className="l ">
                        <p className='my-1'>Parcel Name</p>
                        <input type="text" placeholder='name' className='bg-white w-[500px] border p-2 rounded-md ' />
                       </div>
                    </div>


                        {/*  sendder -> */}
                        <div className=" justify-center my-10 flex gap-5">
                            <div className="w-[500px]">
                            <h1>Sender Details</h1>
                            <p>Sender Name</p>
                            <input type="text" placeholder='Sender Name' className='rounded-md w-full border p-2' />
                        </div>
                        <div className="R w-[500px]">
                            <h1>Sender Details</h1>
                            <p>Sender Name</p>
                            <input type="text" placeholder='Sender Name' className='rounded-md w-full border p-2' />

                        </div>
                        </div>
                </form>

            </div>
        </div>
    );
};

export default SendParscel;