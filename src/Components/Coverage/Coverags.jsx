import { useRef, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
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
const mapRef = useRef(null)
const [searchInput, setSearchInput] = useState('')
const heandelSubmit = (e)=>{
    e.preventDefault()
    const locations = searchInput.trim()
   
    const district = Servicesenter.find(c=>c.region.toLowerCase().includes(locations.toLowerCase()))
    if(district){
        const coord = [ district.latitude,district.longitude];
        mapRef.current.flyTo(coord, 8)

    }
}
const clearSearch = () => setSearchInput('')
    return (
        <section className="my-5 rounded-2xl bg-white p-4 shadow-lg min-[380px]:p-5 sm:my-8 sm:p-8 lg:my-10 lg:p-10">
                <h1 className="text-2xl font-semibold leading-tight text-[#03373D] sm:text-[38px]">We are available in 80 districts</h1>
                <div className="my-5 max-w-xl">
                    <label htmlFor="coverage-location-search" className="mb-2 block text-sm font-semibold text-[#03373D]">
                        Search coverage by location
                    </label>
                    <form onSubmit={heandelSubmit} className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" aria-hidden="true" />
                            <input
                                id="coverage-location-search"
                                type="search"
                                required
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Type a region name"
                                className="input input-bordered w-full bg-base-100 pl-11 pr-12 focus:border-[#A8CE36] focus:outline-none"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="btn btn-circle btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                                    aria-label="Clear coverage search"
                                    title="Clear search"
                                >
                                    <FaTimes aria-hidden="true" />
                                </button>
                            )}
                        </div>
                        <button type="submit" className="btn min-h-11 w-full border-[#A8CE36] bg-[#CAEB66] text-[#03373D] hover:bg-[#B8DD4E] sm:w-auto">
                            <FaSearch aria-hidden="true" />
                            Search
                        </button>
                    </form>
                </div>

                {/* map containor*/}
            <div className="h-[360px] w-full overflow-hidden rounded-2xl min-[380px]:h-[420px] sm:h-[560px] lg:h-[720px]">
                <MapContainer 
                 center={indiaCenter} 
                 zoom={6} 
                 scrollWheelZoom={false}
                 className="h-[360px] min-[380px]:h-[420px] sm:h-[560px] lg:h-[720px]"
                 ref={mapRef}
                 >
                    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                     
                    {
                        Servicesenter.map(serviceData=> <Marker key={`${serviceData.region}-${serviceData.district}`} position={[serviceData.latitude, serviceData.longitude]}>
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
        </section>
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
