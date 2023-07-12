import React, {useEffect, useState} from 'react';
 import AsyncCreatableSelect from "react-select/async-creatable";
import {useSelector} from "react-redux";

const CreatableSelectInput =(props)=> {
    const authUser = useSelector(state => state.authUserReducer);

   const [selectedOption,setSelectedOption]=useState(props.value);
   const [options,setOptions]=useState([]);


   useEffect(()=>{
       fetchOptions();
   },[])

   useEffect(()=>{
       fetchOptions();
       setSelectedOption(props.value);
   },[props.value])

   const fetchOptions = () => {
        axios.get(`${props.endpoint}?api_token=${authUser.api_token}`).then((response) => {
            setOptions(response.data.result.map((item) => ({ value: item.id, label: item.name,item:item })));
        });
    };

   const handleChange = (selectedOption) => {
       props.onChange(selectedOption)
    };

  const  handleCreate = (inputValue) => {
      if(props.createUrl){
          axios.post(props.createUrl, { name: inputValue,api_token:authUser.api_token }).then((response) => {
              console.log({response})
              fetchOptions();
              props.onCreate(response)
          });
      }else{
          props.onCreate(inputValue)
      }
    };

    const loadOptions = (inputValue, callback) => {
        axios
            .get(`${props.endpoint}?query=${inputValue}&api_token=${authUser.api_token}`)
            .then((response) => {
                callback(response.data.result.map((item) => ({ value: item.id, label: item.name,item:item })));
            })
            .catch((error) => {
                console.error(error);
            });
    };


        return (
         <AsyncCreatableSelect
                isClearable
                onChange={handleChange}
                onCreateOption={handleCreate}
                loadOptions={loadOptions}
                value={selectedOption}
                isDisabled={props?.isDisabled}
            />
        );

}

export default CreatableSelectInput
