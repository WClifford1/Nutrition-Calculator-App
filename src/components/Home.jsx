import React, { Component } from 'react'
import { Progress } from 'reactstrap';
import ListedItem from './ListedItem';
import SearchResults from './SearchResults'
import AddItemBox from './AddItemBox';
import diet from '../sample-data'
import '../styles/home.css'
const axios = require('axios');


export default class Home extends Component {


    state = {
        day: this.props.days[0],
        currentSearch: "",
        searchResults: "",
        addItem: "",
        itemData: diet.data_points,
        consumedCalories: 0,
        percentage: 0
    };
    

    // Updates state of currentSearch to whatever is in the searchbar
    // Calls the onSearch function if a search term exists
    updateCurrentSearch = async (event) => {
        if (event.target.value) {
        await this.setState({currentSearch: event.target.value})
        this.onSearch(this.state.currentSearch)
        } else {
        this.setState({currentSearch: event.target.value, searchResults: ""})
        }
    }


    // OnSearch function retrieves search results from API
    // Places the first 5 common and first 5 branded results into state
    onSearch = async (value) => {
            // this.updateCurrentSearch(event)
            let res = await axios.get('https://trackapi.nutritionix.com/v2/search/instant?query=' + value, 
            {
                headers: { 
                    "x-app-id": process.env.REACT_APP_X_API_ID,
                    "x-app-key": process.env.REACT_APP_X_API_KEY
                }
            });
            if (res.data.common.length > 0 || res.data.branded.length > 0) {
            const common = [];
            const branded = [];
            for(let i = 0; i < res.data.common.length && i < 5; i++){
                common.push({
                    food_name: res.data.common[i].food_name,
                    thumb: res.data.common[i].photo.thumb
                })
            };
            for(let i = 0; i < res.data.branded.length && i < 5; i++){
                branded.push({
                    food_name: res.data.branded[i].food_name,
                    thumb: res.data.branded[i].photo.thumb,
                    brand_name: res.data.branded[i].brand_name,
                    nix_item_id: res.data.branded[i].nix_item_id
                })
            };
            await this.setState({searchResults: {common, branded}});
            };
    };


     // Initiates a serach when the enter key is pressed when the search bar is focused
     // Removes search results when the escape key is pressed
    searchEnterKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.onSearch(event.target.value)
        } else if (event.key === 'Escape') {
            this.setState({currentSearch: "", searchResults: ""})
        }
    }


    // Changes to the previous day when left arrow is clicked
    previousDay = async () => {
        const index = this.props.days.indexOf(this.state.day);
        if (index < 2) await this.setState({ day : this.props.days[index + 1]});
        this.totalCalories();
    }


    // Changes to the next day when right arrow is clicked
    nextDay =  async () => {
        const index = this.props.days.indexOf(this.state.day);
        if (index > 0) await this.setState({ day : this.props.days[index - 1]});
        this.totalCalories();
    }


    // Displays the respective calories for the day's breakfast, lunch, dinner and snacks
    mealCalories = (mealtype) => {
        let sum = 0;
        let index = this.props.days.indexOf(this.state.day);
        for(let i = 0; i < this.state.itemData[index].intake_list.length; i++){
            if (this.state.itemData[index].intake_list[i].meal_type === mealtype){
                sum += (this.state.itemData[index].intake_list[i].nf_calories * this.state.itemData[index].intake_list[i].serving_qty)
            }
        };
        return Math.round(sum);
    };


    // Get the total calories for all the day's meals
    totalCalories = async () => {
        let total = this.mealCalories("breakfast") + this.mealCalories("lunch") + this.mealCalories("dinner") + this.mealCalories("snack");
        await this.setState({ consumedCalories : total});
        this.calculatePercentage();
    };


    // If searchbar is empty clicking the add button / search icon will focus it
    // If searchbar is not empty clicking the add button / search icon will search the current search term
    addButton = () => {
        if (!this.state.currentSearch) {
        document.getElementById("searchInput").focus();
        } else {
            for(let i = 0; i < 5; i++){
                if (this.state.searchResults.common[i]) {
                    this.onCommonFoodSelect(this.state.searchResults.common[i].food_name)
                    break
                } else if (this.state.searchResults.branded[i]) {
                    this.onCommonFoodSelect(this.state.searchResults.branded[i].food_name)
                    break
                }
            };
        };
    };


    // Retrieve data when a common item is selected is selected
    onCommonFoodSelect = async (item) => {
        let res = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {query : item},
        {
            headers: { 
                "x-app-id": process.env.REACT_APP_X_API_ID,
                "x-app-key": process.env.REACT_APP_X_API_KEY
            }
        });
        await this.setState({ addItem: { 
            food_name: res.data.foods[0].food_name,
            thumb: res.data.foods[0].photo.thumb,
            serving_qty: res.data.foods[0].serving_qty,
            serving_unit: res.data.foods[0].serving_unit,
            serving_weight_grams: res.data.foods[0].serving_weight_grams,
            nf_calories: res.data.foods[0].nf_calories
        }});
    };

    
    // Retrieves data when a branded item is selected is selected
    onBrandedFoodSelect = async (nix_item_id) => {
        let res = await axios.get('https://trackapi.nutritionix.com/v2/search/item?nix_item_id=' + nix_item_id,
            {
                headers: { 
                    "x-app-id": process.env.REACT_APP_X_API_ID,
                    "x-app-key": process.env.REACT_APP_X_API_KEY
                }
            });
        await this.setState({ addItem: { 
            food_name: res.data.foods[0].food_name,
            thumb: res.data.foods[0].photo.thumb,
            brand_name: res.data.foods[0].brand_name,
            serving_qty: res.data.foods[0].serving_qty,
            serving_unit: res.data.foods[0].serving_unit,
            serving_weight_grams: res.data.foods[0].serving_weight_grams,
            nf_calories: res.data.foods[0].nf_calories
        }});
    };


    // Adds a new item and updates calorie counters
    onAddItem = (item) => {
        let newitemdata = this.state.itemData;
        newitemdata[this.props.days.indexOf(this.state.day)].intake_list.push(item);
        this.setState({ 
            addItem: "",
            searchResults: "",
            currentSearch: "",
            itemData : newitemdata
        });
        this.totalCalories()
    }


    // Closes the box for adding items
    onCloseAddBox = () => {
        this.setState({ addItem: "",
        searchResults: "",
        currentSearch: ""})
    }


    // Calculates the percentage of calories consumed from the daily calorie goal
    calculatePercentage = () => {
        let percent = Math.floor((this.state.consumedCalories / this.props.dailyGoal) * 100)
            this.setState({percentage: percent})
    }


    render() {
        let index = this.props.days.indexOf(this.state.day)

        return (
            <React.Fragment>
            
                {/* The purple header and searchbar at the top */}
                <div id="header">
                    <form id="searchBar" onClick={this.addButton}>
                    <a href="https://www.nutritionix.com/" target="_blank" rel="noopener noreferrer"><img id="logo" src={this.props.nutritionixAPIlogo} alt="powered by NutritionixAPI"></img></a>
                        <i className="fas fa-search"></i>
                        <input placeholder="Search foods..." onKeyDown={this.searchEnterKey} onSubmit={this.onSubmit} onChange={this.updateCurrentSearch} value={this.state.currentSearch} id="searchInput" type="text" />
                    </form>

                    <img id="avatar-image" src={ this.props.avatarImage } alt="avatar"/>
                    <h6 id="userName">{this.props.first_name}</h6>
                    <h6 id="fullUsername">{this.props.first_name} {this.props.last_name}</h6>
                    <div className="weightHeightCircles" id="weightCircle">
                        <h6 className="weightHeightValue">{this.props.weight}</h6>
                        <p className="weightHeightUnit">kg</p>
                    </div>
                    <div className="weightHeightCircles" id="heightCircle">
                        <h6 className="weightHeightValue">{this.props.height}</h6>
                        <p className="weightHeightUnit">cm</p>
                    </div>
                </div>


                {/* Text for the current day and arrows to change day */}
                <div id="daySelectorFlexContainer">
                    <i onClick={this.previousDay} className="fas fa-chevron-left"></i>
                    <h6 id="currentDay">{this.state.day}</h6>
                    <i onClick={this.nextDay} className="fas fa-chevron-right"></i>
                </div>


                {/* Consumed calories and daily goal calories */}
                <div id="consumedGoalsFlexContainer">
                    <section>
                        <h5 className="calsBigText" style={{marginBottom:"0"}}>{this.state.consumedCalories} cal</h5>
                        <p className="calsSmallText">consumed</p>
                    </section>
                    <section id="dailyGoal">
                        <h5 className="calsBigText" style={{marginBottom:"0"}}>{this.props.dailyGoal} cal</h5>
                        <p className="calsSmallText">daily goal</p>
                    </section>
                </div>


                {/* Progess bar and percentage text */}
                <div id="progressBar">
                    <Progress 
                    value={this.state.percentage}
                    color="#6200ee"
                    style={{height:"4px"}}
                    />
                    <p id="percentage"
                    style={{
                        marginLeft: this.state.percentage < 100 ? this.state.percentage - (this.state.percentage * .1) + "%" : "90%",
                        color: this.state.percentage >= 100 ? "red" : ""
                        }}
                    >{
                        this.state.percentage}%
                    </p>
                </div>


                {/* Text for total calories of each meal type */}
                <div className="mealFlexContainer">
                    <section className="breakfast">
                            <h6 className="calCount" style={{marginBottom:"0"}}>{this.mealCalories("breakfast")}</h6>
                            <p className="mealType">Breakfast</p>
                    </section>
                    <section className="lunch">
                            <h6 className="calCount" style={{marginBottom:"0"}}>{this.mealCalories("lunch")}</h6>
                            <p className="mealType">Lunch</p>
                    </section>
                    <section className="dinner">
                            <h6 className="calCount" style={{marginBottom:"0"}}>{this.mealCalories("dinner")}</h6>
                            <p className="mealType">Dinner</p>
                    </section>
                    <section className="snacks">
                            <h6 className="calCount" style={{marginBottom:"0"}}>{this.mealCalories("snack")}</h6>
                            <p className="mealType">Snack</p>
                    </section>
                </div>


                <hr id="homeHR"></hr>
                <section id="graybar">
                </section>
                {/* Search results */}
                { this.state.currentSearch && this.state.searchResults ? <SearchResults onBrandedFoodSelect={this.onBrandedFoodSelect} onCommonFoodSelect={this.onCommonFoodSelect} items={this.state.searchResults} /> : undefined}
                {/* Pop uox for adding selected items */}
                {this.state.addItem && <AddItemBox onCloseAddBox={this.onCloseAddBox} onAddItem={this.onAddItem} item={this.state.addItem} />}


                {/* List of all foods that have been added */}
                {this.state.itemData[index].intake_list.map((item, i) =>
                    <ListedItem
                    key={i}
                    food_name={item.food_name}
                    serving_unit={item.serving_unit}
                    serving_weight_grams={Math.round(item.serving_weight_grams)}
                    serving_qty={item.serving_qty}
                    nf_calories={Math.round(item.nf_calories)}
                    serving_size={item.serving_size}
                    meal_type={item.meal_type}
                    thumb={item.thumb}
                    />
                )}


                {/* Button in bottom right corner - focuses searchbar */}
                <div onClick={this.addButton} id="addItem"><span id="addSymbol">+</span></div>
            </React.Fragment>
        )
    }
}
