import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import AsyncSelect from "react-select/async";

const SelectInput =(props)=> {
    const authUser = useSelector(state => state.authUserReducer);

   const [selectedOption,setSelectedOption]=useState(props.value);
   const [options,setOptions]=useState([]);


   useEffect(()=>{
       fetchOptions();
   },[])

   useEffect(()=>{
       fetchOptions();
   },[props.value])

   const fetchOptions = () => {
        axios.get(`${props.endpoint}?api_token=${authUser.api_token}`).then((response) => {
            setOptions(response.data.result.map((item) => ({ value: item.id, label: item.name,item:item })));
        });
    };

   const handleChange = (selectedOption) => {
       setSelectedOption( selectedOption);
       props.onChange(selectedOption)
    };


    const loadOptions = (inputValue, callback) => {
        axios
            .get(`${props.endpoint}?query=${inputValue}&api_token=${authUser.api_token}`, {
                params: {
                    ...props.params
                }
            })
            .then((response) => {
                callback(response.data.result.map((item) => ({ value: item.id, label: item.name,item:item })));
            })
            .catch((error) => {
                console.error(error);
            });
    };


        return (
         <div>
             <AsyncSelect
                 isClearable
                 onChange={handleChange}
                 loadOptions={loadOptions}
                 value={selectedOption}
                 isDisabled={props?.isDisabled}
             />
         </div>
        );

}

export default SelectInput
