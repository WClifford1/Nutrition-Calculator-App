import React from 'react';
import Home from './components/Home'
import avatarImage from "./images/avatarImage.png"
import diet from './sample-data'
import nutritionixAPIlogo from "./images/NutritionixAPI_hires_flat.png"


function App() {
    
    // Gets the DD/MMM date of two days ago
    const dateOffset = (24*60*60*1000) * 2; //2 days
    let myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset)
    return (
    <React.Fragment>
            <Home 
            first_name={diet.first_name}
            last_name={diet.last_name}
            weight={diet.weight_kg} 
            height={diet.height_cm}
            dailyGoal={diet.daily_goal}
            avatarImage={avatarImage}
            nutritionixAPIlogo={nutritionixAPIlogo}
            days={["Today", "Yesterday", `${myDate.toString().split(' ')[2]} ${myDate.toString().split(' ')[1]}`]}
            />
            
        </React.Fragment>
    );
}

export default App;
