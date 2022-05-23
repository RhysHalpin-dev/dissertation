import UserFlag from './UserFlag.js';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import {socket} from '../service/socket';

/**
 * Covid Component
 * This component populates with covid cases flagged on mongoDB
 * pages are set to size of 10, can be navigated with using arrow buttons
 * @returns 
 */
export default function Users() {


  //State setters and getters
  const [data, setdata] = useState([])
  const [update, setUpdate] = useState(0)
  let [page, setPage] = useState(1)
  let [pageSize] = useState(10)
  let pageTotal = Math.ceil(data.length / pageSize)

  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));
  const classes = useStyles();

  /* SOCKET LISTENERS - waits for change message to be sent from server, updates the update state for re-render purpose in useEffect() */
  socket.on('deleteData', (change) =>{
    setUpdate(data.length) 

  })
  
  socket.on('changeData', (change) =>{
    setUpdate(data.length) 

  })

  /**
   * UseEffect()
   * Ran on component render fetching initial data state
   * re-render when update depandancy is changed
   */
  useEffect(
    () => {
      /* Fetches covid case data from MongoDB */
      const fetchData = async () => {
        const response = await fetch('https://covid-sys.herokuapp.com/crud/covid', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', "authorization": "bearer " + localStorage.getItem("authorization")
          }
        });
        let data = await response.json();
        
        if (response.status === 200) {
          setdata(data);
          console.log(data)


        } else {
          setdata([]);
        }

      }
      fetchData();
    }, [update]);

  return (
    <div className="content">
      <h2>Covid Flags</h2>
      {data.slice(((pageSize * page) - pageSize), (pageSize * page)).map((covid, i) => (<UserFlag key={i} covid={covid} />))}

      <div className="contentButtons">
      <Button onClick={() => setPage(page - 1)} disabled={page <= 1}
        variant="contained"
        size="small"
        color="secondary"
        className={classes.button}
        startIcon={<KeyboardArrowLeftIcon />}
      >prev
      </Button>

      <Button onClick={() => setPage(page + 1)} disabled={page >= pageTotal}
        variant="contained"
        size="small"
        color="secondary"
        className={classes.button}
        endIcon={<KeyboardArrowRightIcon />}
      >
        <span className={classes.buttonText}></span>next
      </Button>
      </div>
    </div>
  );

}