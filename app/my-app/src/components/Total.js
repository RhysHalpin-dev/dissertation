import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {socket} from '../service/socket';

/**
 * Total Component
 * Displays total users currently attending system
 * @param {*} props = each mapped covid case from response data in covid component
 * @returns 
 */
export default function Total(props) {
    const [data, setdata] = useState([])
    const [update, setUpdate] = useState(0)

    socket.on('totalData', (change) =>{
        //setdata(data => [...data, change.fullDocument])
        setUpdate(data.length) 
      })

    useEffect(
        () => {

            const fetchData = async () => {

                const response = await fetch('https://covid-sys.herokuapp.com/crud/total', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', "authorization": "bearer " + localStorage.getItem("authorization")
                    }
                });
                let data = await response.json();
                console.log(data)
                if (response.status === 200) {
                    setdata(data);
                } else {
                    // set state to empty to avoid memory leak in app
                    setdata([]);
                }
            }
            fetchData();
        }, [update]);


    return (
        <div id="admin">
            <div id="adminLeft"><h2 id="sideText">Current attendees: {data.total} Limit: {data.limit}</h2>{data.total < data.limit ? <CheckCircleIcon style={{ color: 'green' }} /> : <CheckCircleIcon style={{ color: 'red' }} />}</div>
            <div id="adminMid"><h1 id="midText"></h1></div>
            <div id="adminRight"><h2 id="sideText">Welcome {props.user}</h2></div>

        </div>


    );
}
