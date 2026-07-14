import logo  from '../../assets/logo.png';

const Logo = () => {
    return (
        <div className="shrink-0">
            <img src={logo} alt="ZapShift" className="h-9 w-auto object-contain sm:h-11" />
        </div>
    );
};

export default Logo;
