import React, {useEffect, useState} from 'react';
import * as Moment from 'moment'
import  * as MomentRange from 'moment-range';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {showSznNotification} from "../../Helpers";
import {saveStudentStateAttr} from "../../redux/actions/studentAction";
import Modal from "../shared/modal/modal";

const WeekTable = () => {
    const myDispatch = useDispatch();
    const {student,trainingDiariesList} = useSelector(state => state.studentReducer);
    const [weeks, setWeeks] = useState([]);
    const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);
    const [reviewObject, setReviewObject] = useState({});
    const [reviews, setReviews] = useState({});
    //get reducer
    const authUser = useSelector(state => state.authUserReducer);
    //trainingDiariesList

    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        //Set the start and end dates
        if(trainingDiariesList && student){

        }
       let we=groupWeeks()
    },[trainingDiariesList,student])

    const groupWeeks=async ()=>{
        console.log({student});
        const startDate = Moment(student?.training_start_date);
        const endDate = Moment(student?.training_end_date);
        const moment = MomentRange.extendMoment(Moment);
        // Create a range object from the start and end dates\
        const dateRange = moment.range(startDate, endDate);
        // // Create an array of all the dates in the range
        const dates = Array.from(dateRange.by('days'));
        //
        // Group the dates by week
        const weeks = {};
        await dates.forEach(date => {
            const weekNumber = date.week();
            if (!weeks[weekNumber]) {
                weeks[weekNumber] = [];
            }
            weeks[weekNumber].push(date);
        });

        setWeeks(weeks)
    }

    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        // Return array of year and week number
        return weekNo.toString();
        //return [d.getUTCFullYear(), weekNo];
    }

    const getTrainingDiaryItem=(date)=>{
       return trainingDiariesList.find(o => o.date === date);
    }
    const submitForReview=(weeks,weekNumber)=>{
       let dates=weeks[weekNumber].map((date)=>{
            return getTrainingDiaryItem(date.format('YYYY-MM-DD'))?.id
        })
        setIsLoading(true);
        axios.post('/api/v1/student/submitForReview', {ids:dates, api_token: authUser.api_token,})
            .then(response => {
                if (response.data.status == 'validation-error') {
                    var errorArray = response.data.message;
                    $.each( errorArray, function( key, errors ) {
                        $.each( errors, function( key, errorMessage ) {
                            showSznNotification({
                                type : 'error',
                                message : errorMessage
                            });
                        });
                    });
                } else if (response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : response.data.message
                    });
                } else if (response.data.status == 'success') {
                    showSznNotification({
                        type : 'success',
                        message : response.data.message
                    });
                    setIsLoading(false);
                    loadData();
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                if (error.response.data.status == 'validation-error') {
                    var errorArray = error.response.data.message;
                    $.each( errorArray, function( key, errors ) {
                        $.each( errors, function( key, errorMessage ) {
                            showSznNotification({
                                type : 'error',
                                message : errorMessage
                            });
                        });
                    });
                } else if (error.response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
                }
            });
    }

    const loadData = () => {
        axios.get('/api/v1/student/getStudentTrainingDiariesList', {
            params: {
                api_token: authUser.api_token,
                id:student?.id
            }
        })
            .then(response => {
                myDispatch(saveStudentStateAttr('trainingDiariesList',response.data.result));

            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
            });
    };


    function checkStatus(weekDays) {
        const dayArray=weekDays.map((date)=>{
            return {
                status_id:getTrainingDiaryItem(date.format('YYYY-MM-DD'))?.status?.id
            }
        })
        // console.log({dayArray})
        const filteredArray = dayArray.filter((item) => (item.status_id !== 2 && item.status_id !== 1));
        console.log({filteredArray})
        const allStatusIdEqualTo1 = filteredArray.length === 0;

        if(allStatusIdEqualTo1){
            return true
        }else{
            return false
        }
    }

    function checkSubmitStatus(weekDays) {
        const dayArray=weekDays.map((date)=>{
            return {
                status_id:getTrainingDiaryItem(date.format('YYYY-MM-DD'))?.status?.id
            }
        })
        // console.log({dayArray})
        const filteredArray = dayArray.filter((item) => (item.status_id === 4));
        console.log({filteredArray})
        const allStatusIdEqualTo1 = filteredArray.length >= 1;

        if(allStatusIdEqualTo1){
            return true
        }else{
            return false
        }
    }

    const openReviewModal=(weeks,weekNumber)=>{
        let dates=weeks[weekNumber].map((date)=>{
            return getTrainingDiaryItem(date.format('YYYY-MM-DD'))?.id
        })

        setIsOpenReviewModal(true)
        setReviewObject({weeks,weekNumber})
        axios.post('/api/v1/student/getTrainingDiariesReviews', {
            ids:dates,
            api_token:authUser.api_token,
            week_no:weekNumber,
            student_id:student?.id
        }).then((response) => {
            console.log({response})
            setReviews(response?.data?.result)
        });
    }

    // Render the table using JSX
    return (
        <table className="table table-striped table-bordered">
            <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            {Object.keys(weeks).map(weekNumber => (
                <React.Fragment key={weekNumber}>
                    <tr style={{background:'#F3F2F1',border:'1px solid'}}>
                        <th colSpan={2}>Week {weekNumber} </th>
                        <th colSpan={2}>
                            {(checkStatus(weeks[weekNumber]))?<button  onClick={()=>{openReviewModal(weeks,weekNumber)}} className="btn-submit" >Reviews</button>:''} &nbsp;
                            {/*{(weekNumber !== getWeekNumber(new Date())? "": <button  onClick={()=>{submitForReview(weeks,weekNumber)}} className="btn-submit" >Submit</button>)}*/}
                            {(checkSubmitStatus(weeks[weekNumber]))? <button disabled={isLoading} onClick={()=>{submitForReview(weeks,weekNumber)}} className="btn-submit" >{isLoading ? "Loading.." : "Submit"}</button>: ''}&nbsp;

                        </th>
                    </tr>
                    {weeks[weekNumber].map(date => (
                        <tr key={date.format('YYYY-MM-DD')}>
                            <td>{date.format('dddd')}</td>
                            <td>{getTrainingDiaryItem(date.format('YYYY-MM-DD'))?.status?.name}  </td> {/* Add your action here */}
                            <td>
                                <Link className="btn-edit" to={'/student/training-diary/edit/'+getTrainingDiaryItem(date.format('YYYY-MM-DD'))?.id}>Edit</Link>
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
            <Modal title={`Review for Week ${reviewObject?.weekNumber}`} isOpen={isOpenReviewModal} onModalClose={()=>{setIsOpenReviewModal(false)}}>

                <div className="form-group">
                    <label>External Supervisor Reviews</label>
                    <table className="table table-striped table-bordered">
                        {reviews?.weekReviewExternal && reviews?.weekReviewExternal.map((item)=>{
                            return  <tr>
                                <td colSpan={2}>{item.review}</td>
                            </tr>
                        })}

                        <tr>
                            <th>Date</th>
                            <th>Review</th>
                        </tr>
                        {reviews?.dayReviewsExternal && reviews?.dayReviewsExternal.map((item)=>{
                            return   <tr>
                                <td>{item?.training_diary?.date}</td>
                                <td>{item?.review}</td>
                            </tr>
                        })}
                    </table>
                    <br/>
                    <label>Internal Supervisor Reviews</label>
                    <table className="table table-striped table-bordered">
                        {reviews?.weekReviewInternal && reviews?.weekReviewInternal.map((item)=>{
                            return  <tr>
                                <td colSpan={2}>{item.review}</td>
                            </tr>
                        })}
                        <tr>
                            <th>Date</th>
                            <th>Review</th>
                        </tr>
                        {reviews?.dayReviewsInternal && reviews?.dayReviewsInternal.map((item)=>{
                            return   <tr>
                                <td>{item?.training_diary?.date}</td>
                                <td>{item?.review}</td>
                            </tr>
                        })}

                    </table>
                </div>
                <div className="modal-footer">

                </div>
            </Modal>
        </table>
    );
};

export default WeekTable;
