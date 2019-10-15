import React from 'react'
import '../styles/searchResults.css'


export default function SearchResults(props) {

    return (
        <div id="searchResults">
            
            {/* Display common results if there are any */}
            {props.items.common.length > 0 && <h6 className="searchType">COMMON</h6>}

            {props.items.common.map((item, index) => 
                <React.Fragment key={index}>
                    <div onClick={() => props.onCommonFoodSelect(item.food_name)} className="searchContainer">
                        <section>
                            <img className="searchImage" src={item.thumb} alt={item.food_name} />
                        </section>

                        <section className="searchFoodName capitalize">
                            {item.food_name}
                        </section>
                    </div>
                    <hr className={props.items.common.indexOf(item) === props.items.common.length - 1 ? "itemlinelong" : "itemline"}></hr>
                </React.Fragment>
            )}

            
            {/* Display branded results if there are any */}
            {props.items.branded.length > 0 && <h6 className="searchType">BRANDED</h6>}
            {props.items.branded.map((item, index) => 
                <React.Fragment key={index}>

                <div onClick={() => props.onBrandedFoodSelect(item.nix_item_id)} className="searchContainer">
                    <section>
                        <img className="searchImage" src={item.thumb} alt={item.food_name} />
                    </section>

                    <section className="searchFoodName capitalize">
                        {item.food_name}
                    </section>
                </div>
                <hr className="itemline"></hr>
                </React.Fragment>
            )}
        </div>
    )
}