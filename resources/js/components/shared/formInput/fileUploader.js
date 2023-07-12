import React, {Fragment, useEffect, useRef, useState} from "react";

const FileUploader=(props)=>{
    const inputFileRef = useRef(null);

    const showFileDialog = () => {
        inputFileRef.current && inputFileRef.current.click();
    };


    const uploadFiles = (e) => {
        if(props?.onUpload){
            props?.onUpload(e)
        }
        e.target.value = null;
        // files && context.uploadItems(files);

    };

    return <Fragment>
        <input
            style={{ display: 'none' }}
            ref={inputFileRef}
            type="file"
            accept={props.accept}
           // accept={props?.isImage ? 'image/*' : '*'}
            multiple={false}
            onChange={(e) => {
                uploadFiles(e);
            }}
        />
        {props?.isIcon?<i className={props.label} onClick={() => {
            showFileDialog();
        }} ></i>:<button style={{margin:"auto"}} onClick={() => {
            showFileDialog();
        }} className="btn-edit" >{props.label}</button>}
    </Fragment>
}

export default FileUploader
