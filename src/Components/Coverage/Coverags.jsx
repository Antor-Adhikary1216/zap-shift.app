import React, { useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import  "../../../node_modules/leaflet/dist/css/leaflet.css"
import { useLoaderData } from 'react-router';
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Zoom } from 'swiper/modules';

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
const mapRef = useRef(null)
const heandelSubmit = (e)=>{
    e.preventDefault()
    const locations = e.target.location.value 
   
    const district = Servicesenter.find(c=>c.region.toLowerCase().includes(locations.toLowerCase()))
    if(district){
        const coord = [ district.latitude,district.longitude];
        console.log( district,coord)
        mapRef.current.flyTo(coord, 8)

    }
}
    return (
        <div>
            <div className=" bg-white shadow-lg p-10 my-10 rounded-2xl  ">
                <h1 className='text-3xl font-semibold sm:text-[38px]'>We are available in 80 districts</h1>
                <div className=" my-5 ">
                    {/* from */}
                    <form onSubmit={heandelSubmit} >
                                     <label className="input ">
                        <CiSearch className='text-[25px]' />
                    <input type="search" required placeholder="Search " name='location' />
                    <button className='bg-[#CAEB66] px-4  py-2 cursor-pointer  text-center '>Search</button>
                                </label>
 
                    </form>
                </div>

                {/* map containor*/}
            <div className="h-[420px] w-full rounded-2xl sm:h-[560px] lg:h-[720px]">
                <MapContainer 
                 center={indiaCenter} 
                 zoom={6} 
                 scrollWheelZoom={false}
                 className='h-[420px] sm:h-[560px] lg:h-[720px]'
                 ref={mapRef}
                 >
                    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                     
                    {
                        Servicesenter.map(serviceData=> <Marker position={[serviceData.latitude, serviceData.longitude]}>
                        <Popup>
                              <strong>{serviceData.region}</strong> <br /> <span>{serviceData.district} , {serviceData.city} ,
                                {serviceData.covered_area} <br />
                                
                                   </span>
                                <span className='font-medium text-green-500'>{serviceData.status}</span>
                                <img src={serviceData.flowchart} alt="" />
                                
                           
                              

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
