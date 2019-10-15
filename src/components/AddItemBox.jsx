import React, { Component } from 'react'
import '../styles/addItemBox.css'
import { Menu, Dropdown, Icon } from 'antd';
import 'antd/dist/antd.css';


export default class AddItemBox extends Component {


    state = {
        serving_qty : 1,
        meal_type: "breakfast"
    }


    // Increase the quantity of servings to add
    increaseserving_qty = () => {
        this.setState({ serving_qty: this.state.serving_qty + 0.5})
    }


    // Increase the quantity of servings to add
    decreaseserving_qty = () => {
        if (this.state.serving_qty > 0){
        this.setState({ serving_qty: this.state.serving_qty - 0.5})
        }
    }


    // Change the meal type for the item
    changeMealType = (meal_type) => {
        this.setState({meal_type})
    }


    // Upon adding the item apply updates to quanity of servings and subsequent total calories and grams
    onAdd = async () => {
        let updatedItem = this.props.item
        updatedItem.serving_qty = this.state.serving_qty
        // updatedItem.nf_calories *= this.state.serving_qty
        // updatedItem.serving_weight_grams *= this.state.serving_qty
        updatedItem.meal_type = this.state.meal_type
        await this.setState({ serving_qty : 1})
        this.props.onAddItem(updatedItem)
    }

    render() {

        const meals = ["breakfast", "lunch", "dinner", "snack"]

        const menu = (
            <Menu style={{backgroundColor:"#e8e8e8"}}>
                {meals.map((meal, index) => 
                    meal !== this.state.meal_type && 
                        <Menu.Item onClick={() => this.changeMealType(meal)} key={index}>
                            <p className="dropdownMenu capitalize">{meal}</p>
                        </Menu.Item> 
                )}
            </Menu>
        );
    
        return (
            <div id="addBox">

                {/* Image of food */}
                <section>
                    <img id="boxImage" src={this.props.item.thumb} alt={this.props.item.food_name} />
                </section>


                {/* Purple X in top right corner */}
                <Icon id="closeBox" type="close" onClick={this.props.onCloseAddBox} />


                {/* Food name */}
                <section className="boxFoodName capitalize">
                    {this.props.item.food_name}
                </section>

                <section className="boxBrandName capitalize">
                    {this.props.item.brand_name}
                </section>

                <hr id="boxLine"></hr>

                {/* Serving selector, grams and calories */}
                <div id="boxServingsFlexContainer">

                    <div id="serving_qtySelector">
                        <section>
                        <p id="servingsText">Servings</p>
                        <span id="servingsQty">{this.state.serving_qty > 0.5 ? this.state.serving_qty.toPrecision(2) : this.state.serving_qty}</span>
                        </section>
                        <section id="servingsArrows">
                            <i onClick={this.increaseserving_qty} className="fas fa-chevron-up"></i>
                            <br/>
                            <i onClick={this.decreaseserving_qty} className="fas fa-chevron-down"></i>
                        </section>
                    </div>

                    <section id="servingGrams">
                        <p className="servingBig">{Math.round(this.props.item.serving_weight_grams * this.state.serving_qty)}</p>
                        <p className="servingSmall">grams</p>
                    </section>

                    <section id="servingCalories">
                        <p className="servingBig">{Math.round(this.props.item.nf_calories * this.state.serving_qty)}</p>
                        <p className="servingSmall">calories</p>
                    </section>

                </div>

                <p id="servingUnit">{this.props.item.serving_unit}</p>

                <hr id="boxLine"></hr>

                <p id="addLabel">ADD TO TODAY</p>

                {/* Dropdown menu for changing meal type */}
                <Dropdown overlay={menu} trigger={['click']}>
                    <div id="dropdown">
                    <p className="ant-dropdown-link capitalize">
                    {this.state.meal_type}
                    </p>
                    <i id="dropdownIcon" className="fas fa-chevron-down"></i>
                    </div>
                </Dropdown>

                {/* Add button */}
                <button onClick={this.onAdd} id="addButton">ADD</button>
            </div>
        )
    }
}