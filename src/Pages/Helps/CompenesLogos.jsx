import React from 'react';
import casio from "../../assets/brands/casio.png"
import amazon from "../../assets/brands/amazon.png"
import moon from "../../assets/brands/moonstar.png"
import star from "../../assets/brands/star.png"
import starpepol from "../../assets/brands/start_people.png"
import randed from "../../assets/brands/randstad.png"

const CompenesLogos = () => {
    return (
        <div className='flex gap-10 my-5'>
           <img src={casio} alt="" /> 
           <img src={amazon} alt="" /> 
           <img src={moon} alt="" /> 
           <img src={star} alt="" /> 
           <img src={starpepol} alt="" /> 
           <img src={randed} alt="" /> 
        </div>
    );
};

export default CompenesLogos;

// casio amazon moon strt starpop rand