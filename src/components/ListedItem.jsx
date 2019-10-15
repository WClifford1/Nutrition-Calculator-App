import React from 'react'
import '../styles/listedItem.css'

export default function ListedItem(props) {
    

    return (
        <div id="hi">
            <div className="itemFlexContainer">
            
                <section>
                    <img id="itemImage" src={props.thumb} alt={props.name} />
                </section>
                
                <section id="nameAndServing">
                    <p style={{marginBottom:"0"}} className="fn bigText capitalize">
                        {props.food_name}
                    </p>
                    <p style={{marginBottom:"0"}} className="subText">
                        {`${props.serving_qty ? props.serving_qty : ""} ${props.serving_unit ? props.serving_unit : ""} ${props.serving_weight_grams ? props.serving_weight_grams * props.serving_qty : ""} g`}
                    </p>
                </section>

                <section id="calsAndMealtype">
                    <p style={{marginBottom:"0"}} className="bigText">
                        {props.nf_calories && props.nf_calories * props.serving_qty} cal
                    </p>
                    <p style={{marginBottom:"0"}} className="subText capitalize">
                        {props.meal_type}
                    </p>
                </section>

            </div>
            <hr id="itemBottom" align="right"></hr>
        </div>
    )
}
