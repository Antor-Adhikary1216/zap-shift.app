import React from 'react';
import agent from '../../assets/png/TeamsDwon/agent-pending.png'

const BeaRider = () => {
    return (
        <div>
            <div className="lg:w-[1100px] shadow-md py-5 px-7 bg-white my-7 rounded-2xl mx-auto">
                <h1 className=' text-5xl my-2 font-semibold'>Be a Rider</h1>
                <p className='text-[#606060] my-3'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal <br /> packages to business shipments — we deliver on time, every time.</p>

                <div className="main flex my-5 justify-between">

                    <div className="L">
                        <h1 className='text-3xl font-semibold'>Tell us about yourself</h1>
                        <div className="inputS">
                            <form>
                                {/* Name  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* License number  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your email */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your regison *1 */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your distric *1 */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your Aadhaar no  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your phone no  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your Bick breand  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your Bick Registertion no  */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                                {/* your Bick tell about us   */}
                                <fieldset className="fieldset">
                 <legend className="fieldset-legend">What is your name?</legend>
                      <input type="text" className="input" placeholder="Type here" />
                            </fieldset> 
                            </form>
                        </div>

                    </div>
                    <div className="R">
                        <img src={agent} alt="" />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeaRider;