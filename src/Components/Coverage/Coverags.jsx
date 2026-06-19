import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import  "../../../node_modules/leaflet/dist/css/leaflet.css"
import { useLoaderData } from 'react-router';
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Coverags = () => {
     const indiaCenter = {
    lat: 20.5937,
  lng: 78.9629
};

const Servicesenter = useLoaderData()
console.log(Servicesenter)
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
            <div className=" rounded-2xl w-[1280] h-[720px]">
                <MapContainer 
                 center={indiaCenter} 
                 zoom={6} 
                 scrollWheelZoom={false}
                 className='h-[720px]'
                 >
                    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                     
                    {
                        Servicesenter.map(serviceData=> <Marker position={[serviceData.latitude, serviceData.longitude]}>
                        <Popup>
                               A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>

                     </Marker>)
                    }

                </MapContainer>
            </div>
            </div>

            
        </div>
    );
};

export default Coverags;

// {
//     "region": "Madhya Pradesh",
//     "district": "Jabalpur",
//     "city": "Jabalpur",
//     "covered_area": [
//         "Napier Town",
//         "Wright Town",
//         "Ranjhi",
//         "Madan Mahal"
//     ],
//     "status": "active",
//     "flowchart": "https://example.com/jabalpur-flowchart.png",
//     "longitude": 79.9864,
//     "latitude": 23.1815
// }