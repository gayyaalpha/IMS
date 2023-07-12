import React, {  useState, useEffect } from 'react'
import Carousel from "../carousel/Carousel";
import {useDispatch, useSelector} from "react-redux";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
const NewsSlider=()=>{

    const myDispatch = useDispatch();
    const {newss} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);

    useEffect(()=>{
        loadNews();

    },[])

    const loadNews = (title='') => {
        axios.get('/api/v1/news/list', {
            params: {
                api_token: authUser.api_token,
                name:title
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('newss',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const renderNews=(item)=>{
        return  <div style={{padding: 10}}>
            <label>{item.title}</label>
            <div className="news-short-description">
                {item.short_description}
            </div>
            <span className="news-link">
              <a href={`/news/${item.id}`}>Read More</a>
            </span>
        </div>
    }
    return <div>

        <Carousel
         slidesPerView={5}
         autoplay={{
             delay: 4500,
             disableOnInteraction: false
         }}
         items={newss?newss:[
            {id:1,title:'News1',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
            {id:2,title:'News2',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
            {id:3,title:'News3',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
            {id:4,title:'News4',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
            {id:5,title:'News5',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
            {id:6,title:'News6',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
            {id:7,title:'News7',short_description:'Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.'},
        ]}
        onRenderItemBody={renderNews}
        />

    </div>
}

export default NewsSlider
