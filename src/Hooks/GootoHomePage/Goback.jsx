import React from 'react';
import { FaHandPointLeft } from 'react-icons/fa';
import { NavLink } from 'react-router';

const Goback = () => {
    return (
        <div>
           <NavLink to="/" ><button className="btn btn-outline btn-info rounded-2xl  border-none shadow-none"> <span><FaHandPointLeft /></span> Back to Home</button></NavLink>
        </div>
    );
};

export default Goback;