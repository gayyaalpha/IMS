import React, {  useState, useEffect } from 'react'
import ProfileCard from "../../admin/ProfileCard";
import NewsSlider from "./newsSlider";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import rootAction from "../../../redux/actions";
import CkEditor from "../formInput/CkEditor";
const News=()=>{
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {news} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    useEffect(() => {
        document.title = 'News';

        myDispatch(rootAction.setActiveComponent('News'));

        if(id){
            getNewsById();
        }

    }, []);

    const getNewsById = () => {
        axios.get('/api/v1/news/getNewsById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCommonStateAttr('news',response.data.message));
            })
            .catch((error) => {
                console.log(error);
            });
    };


    return  <React.Fragment>
        <div className="card animated fadeIn">
            <div className="card animated fadeIn">
                <div className="card animated fadeIn">
                    <div className="card-body">
                      <h4>{news?.title} </h4>

                        {news?.short_description}
                        <br/>
                        {news?.description &&  <div dangerouslySetInnerHTML={{__html: news?.description}}></div>}
                    </div>
                </div>
            </div>


        </div>
    </React.Fragment>
}
export default News
