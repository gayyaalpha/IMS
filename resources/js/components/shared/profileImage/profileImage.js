import React, { useState, useEffect, useRef } from 'react'
import FileUploader from "../formInput/fileUploader";
import {showSznNotification} from "../../../Helpers";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";

const ProfileImage=(props)=>{
    const myDispatch = useDispatch();
    const [userData,setUser]=useState(null);
    const {user} = useSelector(state => state.commonReducer);
    const ref = React.useRef(null);
    useEffect(()=>{
        setUser(user);
    },[user])
   const uploadProfileImage=(e)=>{
        const f = e.target.files[0];
        const formData = new FormData();
        formData.append('api_token', authUser.api_token);
        formData.append('file', f);

        axios.post('/api/v1/profile/imageUpload', formData,{headers: {
                "Content-Type": "multipart/form-data",
            },})
            .then(response => {
                console.log('response then',response)
                if (response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : response.data.message
                    });
                } else if (response.data.status == 'success') {
                    showSznNotification({
                        type : 'success',
                        message : response.data.message
                    });
                    myDispatch(saveCommonStateAttr('user',response.data.result));
                    document.getElementById("profileImage").src=response.data.result?.img;
                    ref.current.src=response.data.result?.img;
                }else{
                    console.log({response});
                }
            })
            .catch((error) => {
                console.log('response catch',error)
                console.log(error);

                if (error.response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
                }
            });
    }
    const getImagePath=()=>{
        if(props.imagePath){
         return props.imagePath
        }else if(userData && userData?.img){
            return  userData && userData?.img
        }else{
         return "/assets/images/faces/face1.jpg"
        }
    }
    return <div className="image-container szn-widget__media szn-hidden-">
        <img  ref={ref} src={getImagePath()} alt="image" />
        <div className="overlay">
            <FileUploader
                isIcon={true}
                label={'mdi mdi-camera'}
                accept={'.png, .jpeg, .jpg'}
                onUpload={(file)=>{uploadProfileImage(file)}}
            />
        </div>
    </div>
}

export default ProfileImage
