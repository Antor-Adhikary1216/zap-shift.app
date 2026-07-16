import { FaHandPointLeft } from 'react-icons/fa';
import { NavLink } from 'react-router';

const Goback = () => {
    return (
        <NavLink to="/" className="btn btn-outline btn-info min-h-11 rounded-2xl border-none shadow-none">
            <FaHandPointLeft /> Back to Home
        </NavLink>
    );
};

export default Goback;
