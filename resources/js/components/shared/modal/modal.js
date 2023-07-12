import React, { useEffect } from 'react'



const Modal=({isOpen,title,children,onModalClose})=>{

    return <div id="modal" className={`modal ${isOpen?'open':''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <span onClick={()=>{onModalClose()}} className="close-button">&times;</span>
                    </div>
                    <div style={{padding:20}}>
                        {children}
                    </div>
                </div>
          </div>
};

export default Modal
