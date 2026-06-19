import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import  "../../../node_modules/leaflet/dist/css/leaflet.css"

const Coverags = () => {
    const indiaCenter = {
    lat: 20.5937,
  lng: 78.9629
};
    return (
        <div>
            <div className=" bg-white shadow-lg p-10 my-10 rounded-2xl  ">
                <h1 className='text-[38px] font-semibold'>We are available in 64 districts</h1>
                <div className=" my-5 ">
                    <label className="input ">
                        <CiSearch className='text-[25px]' />
  <input type="search" required placeholder="Search "  />
 
</label>
 <button className='bg-[#CAEB66] px-4  py-2 cursor-pointer  text-center rounded-r-full '>Search</button>

                </div>

                {/* map containor*/}
            <div className=" rounded-2xl w-[1280] h-[420px]">
                <MapContainer 
                 center={indiaCenter} 
                 zoom={8} 
                 scrollWheelZoom={false}
                 className='h-[420px]'
                 >
                    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                     
                     <Marker position={indiaCenter}>
                        <Popup>
                               A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>

                     </Marker>

                </MapContainer>
            </div>
            </div>

            
        </div>
    );
};

export default Coverags;