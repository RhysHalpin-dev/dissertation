import React, { useState, useEffect } from 'react';
import Covid from './Covid.js';
import Recent from './Recent.js';
import { useHistory } from "react-router-dom";
import Total from './Total.js';

/**
 * Admin Component
 * renders the main monitoring environment for the activity  and covid case data streams
 * @param {*} props 
 * @returns 
 */
export default function Admin(props) {

    //INIT states
    const [user, setUser] = useState('')

    let history = useHistory()
    useEffect(() => {
        checkLogin()
        checkName()
    });
    /* request the current username associated with JWT for welcome message render */
    const checkName = async () => {
        let data = await fetch('https://covid-sys.herokuapp.com/crud/getName', {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": "bearer " + localStorage.getItem("authorization")
            }
        })

        data = await data.json();
        //sets the user state to the username
        setUser(data.name)
    }

    const checkLogin = async () => {
        let data = await fetch('https://covid-sys.herokuapp.com/isAuth', {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": "bearer " + localStorage.getItem("authorization")
            }
        })

        data = await data.json();
        console.log(data)

        if (data.auth === false) {
            //logout();
            setUser(null)
            localStorage.removeItem("authorization")
            history.replace("/");
        }
    }


    return (

        <div>
            
            <Total  user={user}/>{/*passes user state as prop to total component for user name render */}

            <div id="container">
                <div id="users"><Covid></Covid></div>
                <aside id="activity"><Recent></Recent></aside>
            </div>
        </div>
    );
}