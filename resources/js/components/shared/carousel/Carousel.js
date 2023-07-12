import React, {useEffect, useRef, useState} from "react";
/************************************
 1. If you want to add or remove items you will need to change a variable called $slide-count in the CSS *minimum 3 slides

 2. if you want to change the dimensions of the slides you will need to edit the slideWidth variable here 👇 and the $slide-width variable in the CSS.
 ************************************/
import './carousel.css';
import {Swiper, SwiperSlide} from 'swiper/react';
// import required modules
import {Pagination, Autoplay} from 'swiper';

// import 'swiper/css/pagination';
const Carousel = (props) => {



    const renderItem=()=>{
        if(props.items && props.items.length>0)
        return props.items.map((item)=>{
            return   <SwiperSlide> {props.onRenderItemBody(item)}</SwiperSlide>
        })
    }
    return(
        <div>
            <div style={{height: 200}}>
                <Swiper
                    slidesPerView={props.slidesPerView?props.slidesPerView:3}
                    spaceBetween={20}
                    pagination={{
                        clickable: true
                    }}
                    {...props}
                    modules={[Autoplay, Pagination]}
                    className="mySwiper"
                >
                    {renderItem()}

                </Swiper>
            </div>
        </div>
    );
};

export default Carousel
