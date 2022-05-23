import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

/*
 * User Component
 * displays details associated with current covid flag in the map - component will render multple time for each object in the map
 * @Param props = each mapped covid case from response data in covid component
 */
export default function User(props) {
    const classes = useStyles();

    /*Function to remove covid case from mongoDB database - JWT token authentication used for protected endpoint communication */
    const deleteCovid = async () => {
        let data = await fetch('https://covid-sys.herokuapp.com/crud/covid/' + props.covid.name, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "*",
                "authorization": "bearer " + localStorage.getItem("authorization")
            }
        })

        data = await data.json();
        console.log(props._id)
        console.log(data)

    }

    return (

        <div className="table">
            <header>
                <div className="col">Email:</div>
                <div className="col">Name:</div>
                <div className="col">Status:</div>
                <div className="col">Temp:</div>
                <div className="col">date:</div>
                {/*<div className="col">View:</div>*/}
                <div className="col"></div>
            </header>
            <div className="row">
                <div className="col">{props.covid.email}</div>
                <div className="col">{props.covid.name}</div>
                <div className="col">{props.covid.covidFlag === true ? <span id="covid">COVID</span> : null}</div>
                <div className="col">{props.covid.temp} °C</div>
                <div className="col">{props.covid.date}</div>
                <div className="col"><Button onClick={() => deleteCovid()}
                    variant="contained"
                    size="small"
                    color="secondary"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                >Delete
      </Button></div>
            </div>

        </div>
    );

}