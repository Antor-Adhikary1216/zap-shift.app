import React from 'react';
import agent from '../../assets/png/TeamsDwon/agent-pending.png'
import RiderRison from './RiderRsion/RiderRison';


const resonPromsese = fetch('/Resoin.json')
.then(res=>res.json())


const BeaRider = () => {
    return (
        <div>
            <div className="lg:w-[1100px] shadow-md py-5 px-7 bg-white mt-5 mb-20 rounded-2xl mx-auto">
                <h1 className=' text-5xl my-2 font-semibold'>Be a Rider</h1>
                <p className='text-[#606060] my-3'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal <br /> packages to business shipments — we deliver on time, every time.</p>

                <div className="main flex my-5 justify-between">

                    <div className="L">
                        <h1 className='text-3xl font-semibold'>Tell us about yourself</h1>
                        <div className="inputS">
                            <form>
                                {/* Name  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your Name?</legend>
                      <input type="text" className="input" placeholder="Type your Name" />
                            </fieldset> 
                                {/* License number  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">Driving License Number</legend>
                      <input type="text" className="input" placeholder="Type your License Number " />
                            </fieldset> 
                                {/* your email */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your Email?</legend>
                      <input type="text" className="input" placeholder="Type your Email" />
                            </fieldset> 
                                {/* your regison *1 */}
                             <RiderRison resonPromsese={resonPromsese} ></RiderRison>
                                {/* your distric *1 */}
                                <fieldset className="fieldset">
                       <legend className="fieldset-legend">Your District</legend>
                      <select defaultValue="select" className="select">
                        <option disabled={true}>select your district</option>
                         <option>select your district</option>
                         
                        </select> 
                           </fieldset>  
                                {/* your Aadhaar no  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">Enter your aadhaar No:</legend>
                      <input type="text" className="input" placeholder="Type here aadhaar No" />
                            </fieldset> 
                                {/* your phone no  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">Enter your phone No:</legend>
                      <input type="text" className="input" placeholder="Type here phone No" />
                            </fieldset> 
                                {/* your Bick breand  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">Bike Brand Model and Year</legend> 
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your Bick Registertion no  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">Bike Registration Number</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your Bick tell about us   */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">Tell Us About Yourself</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                            {/* button for submit */}
                            <button className="btn btn-xs lg:w-full my-3 bg-[#CAEB66] text-black sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">Submit</button>
                            </form>
                        </div>

                    </div>
                    <div className="R">
                        <img src={agent} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeaRider;