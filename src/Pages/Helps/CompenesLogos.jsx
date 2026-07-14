import casio from "../../assets/brands/casio.png"
import amazon from "../../assets/brands/amazon.png"
import moon from "../../assets/brands/moonstar.png"
import star from "../../assets/brands/star.png"
import starpepol from "../../assets/brands/start_people.png"
import randed from "../../assets/brands/randstad.png"

const CompenesLogos = () => {
    return (
        <div className="my-5 flex shrink-0 items-center gap-8 px-4 sm:gap-12 sm:px-6">
           <img src={casio} alt="Casio" className="h-8 w-auto max-w-28 object-contain sm:h-10" />
           <img src={amazon} alt="Amazon" className="h-8 w-auto max-w-28 object-contain sm:h-10" />
           <img src={moon} alt="Moonstar" className="h-8 w-auto max-w-28 object-contain sm:h-10" />
           <img src={star} alt="Star" className="h-8 w-auto max-w-28 object-contain sm:h-10" />
           <img src={starpepol} alt="Start People" className="h-8 w-auto max-w-28 object-contain sm:h-10" />
           <img src={randed} alt="Randstad" className="h-8 w-auto max-w-28 object-contain sm:h-10" />
        </div>
    );
};

export default CompenesLogos;

// casio amazon moon strt starpop rand
