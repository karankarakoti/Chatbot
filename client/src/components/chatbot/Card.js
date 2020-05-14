import React from 'react';
 

const Card=(props)=>{
    return(
        <div style={{float:'left', paddingRight:30, height:270}}>
            <div className="card">
                <div className="card-image" style={{width:240}}>
                    <img src={props.payload.image} alt={props.payload.header}/>
                        <span className="card-title">{props.payload.header}</span>
                </div>
                <div className="card-content">
                    {props.payload.description}
                </div>
                <div className="card-action">
                    <a href={props.payload.link} target="_blank" rel="noopener noreferrer">Here is a link</a>
                </div>
            </div>
        </div>
    );
};

export default Card;