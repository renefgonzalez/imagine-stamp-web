import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function GaleriaPasteles() {
  const totalFotos = 20;
  const fotos = Array.from({ length: totalFotos }, (_, index) => `/galeria-pasteles/${index + 1}.webp`);

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 px-4 mt-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Inspiración: Algunos de nuestros trabajos
      </h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-72 md:h-80 rounded-xl"
      >
        {fotos.map((fotoSrc, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full overflow-hidden rounded-xl shadow-lg border border-gray-100">
              <img
                src={fotoSrc}
                alt={`Pastel de Lázaro Pastelería ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
