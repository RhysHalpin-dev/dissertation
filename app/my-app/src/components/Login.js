import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";


/**
 * Login Component
 * @param {*} props 
 * @returns 
 */
function Login(props) {
    console.log(props)
    const [name, setName] = useState([]);
    const [password, setPassword] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')


    let history = useHistory()

    useEffect(() => {
        checkLogin()
    }, []);

    const submit = async (event) => {
        event.preventDefault();

        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "authorization": "bearer " + localStorage.getItem("authorization") },
            body: JSON.stringify({ email: name, password: password })
        };

        const response = await fetch('https://covid-sys.herokuapp.com/login', reqOptions);
        let data = await response.json();

        if (response.status === 200) {
            localStorage.setItem('authorization', data.token);
            props.onLoginChange(true)
            localStorage.setItem("login", true)

            history.push("/admin");
        } else if (response.status === 401) {
            console.log(data)
            setErrorMessage(data.mess)
        }
        console.log(localStorage.getItem('authorization'));

    }
    const checkLogin = async () => {
        console.log(localStorage.getItem("authorization"));
        let data = await fetch('https://covid-sys.herokuapp.com/isAuth', {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": "bearer " + localStorage.getItem("authorization")
            }
        })

        data = await data.json();

        if (data.auth === false) {
            //logout();
            props.onLoginChange(false)
            localStorage.setItem("login", false)
            localStorage.removeItem("authorization")
            history.replace("/");
        }

        if (data.auth === true) {
            
            history.replace("/admin")
        }
    }


    return (
        <div>
            <h2 id="login">LOGIN</h2>
            <form onSubmit={submit}>
                <label>
                    User:
                    <input type="email" value={name} required onChange={e => setName(e.target.value)} />
                    Password:
                    <input type="password" value={password} required onChange={e => setPassword(e.target.value)} />
                    <input id="submitButton" type="submit" value="Login" />
                    {errorMessage}
                </label>
                

            </form>

            <button onClick={checkLogin}> check login</button>
        </div>
    );
}
export default withRouter(Login)