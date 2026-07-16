import { use } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import ReviwCard from './ReviwCard';

const Reviws = ({ReviwPromises}) => {
    const datas = use(ReviwPromises)

 
  
    
    
    return (
        <>
      <section className="mx-auto my-8 min-w-0 sm:my-10">
        <Swiper
        loop={true}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        spaceBetween={12}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        coverflowEffect={{
          rotate: 8,
          stretch: 0,
          depth: 60,
          modifier: 1,
          scale:0.75,
          slideShadows: true,
           
        }}
        autoplay={{
            delay:2000,
            disableOnInteraction:false
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination,Autoplay]}
        className="mySwiper pb-12"
      >
        {
            datas.map(data=><SwiperSlide key={data.id} className="h-auto">
          <ReviwCard data={data} ></ReviwCard>
        </SwiperSlide>)
        }
       
      </Swiper>
      </section>
    </>
    );
};

export default Reviws;

// {
//     "id": "5f47ac10b4f1c03e8c567898",
//     "user_email": "aman.khan@example.com",
//     "userName": "Aman Khan",
//     "delivery_email": "delivery9@example.com",
//     "ratings": 2.5,
//     "review": "The delivery was delayed and the package condition was not good.",
//     "parcel_id": "5f47ac10b4f1c03e8c098773",
//     "pick_up_email": "pickup9@example.com",
//     "user_photoURL": "https://randomuser.me/api/portraits/men/28.jpg",
//     "date": "2024-08-10T17:50:00.000Z"
// }
