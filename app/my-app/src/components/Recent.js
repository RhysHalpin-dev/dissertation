import Status from './Status.js';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import { socket } from '../service/socket';

/**
 * Recent Component
 * @returns 
 */
export default function Recent() {

    //FETCH STATES
    const [data, setdata] = useState([])
    const [update, setUpdate] = useState(0)

    //INIT PAGE STATES
    let [page, setPage] = useState(1)
    let [pageSize] = useState(10)
    let pageTotal = Math.ceil(data.length / pageSize)

    const useStyles = makeStyles((theme) => ({
        button: {
            margin: theme.spacing(1),
        },
    }));

    const classes = useStyles();

    //Listener sets update state when websocket message recieved from webserver
    socket.on('activityData', (change) => {
        setUpdate(data.length)

    })
    /**
       * UseEffect()
       * Ran on component render fetching initial data state
       * re-render when update depandancy is changed
       */
    useEffect(
        () => {

            const fetchData = async () => {

                const response = await fetch('https://covid-sys.herokuapp.com/crud/activity', {
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
                    setdata([]);
                }
            }
            fetchData();
        }, [update]);



    return (
        <div className="content2">
            <h2>Activity</h2>
            {data.slice(((pageSize * page) - pageSize), (pageSize * page)).map((activity, i) => (<Status key={i} activity={activity} />))}
            <div className="contentButtons">
                <Button onClick={() => setPage(page - 1)} disabled={page <= 1}
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classes.button}
                    startIcon={<KeyboardArrowLeftIcon />}
                >prev
      </Button>
                <Button onClick={() => setPage(page + 1)} disabled={page >= pageTotal}
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classes.button}
                    endIcon={<KeyboardArrowRightIcon />}
                >next
      </Button>
            </div>
        </div>
    );

}