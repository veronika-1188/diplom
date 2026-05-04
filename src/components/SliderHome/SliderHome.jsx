import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'
import './slider__home.css'

import slide1 from '../../assets/img/SliderHome/Slide1.jpg'
import slide2 from '../../assets/img/SliderHome/Slide2.jpg'

import 'swiper/css';
import 'swiper/css/pagination';
import GoToCatalog from '../GoToCatalog/GoToCatalog';

export default function SliderHome() {
    return (
        <section className="hero">
            <Swiper className="slider__container"
                modules={[Pagination, Autoplay]}
                spaceBetween={40}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}>

                <SwiperSlide className="hero__inner">
                    <img src={slide1} alt="Собака с игрушкой" className='hero__image'></img>
                    <div className="hero__content">
                        <span className="hero__label">НОВИНКИ</span>
                        <h1 className="hero__title">
                            Скидка 20% <br />
                            на первые заказы <span>для новых клиентов</span>
                        </h1>
                        <GoToCatalog text={"В КАТАЛОГ"}/>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="hero__inner">
                    <img src={slide2} alt="Кошка с игрушкой" className='hero__image'></img>
                    <div className="hero__content">
                        <span className="hero__label">АКЦИЯ 1+1=3</span>
                        <h1 className="hero__title">
                            Купи две игрушки <br />
                            <span>третью — в подарок!</span>
                        </h1>
                        <GoToCatalog text={"ВЫБРАТЬ"}/>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}