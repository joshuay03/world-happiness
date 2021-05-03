import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default function Register() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const URL = 'http://131.181.190.87:3000/user/register';
    const [status, setStatus] = useState({
        error: true
    });
    const [alert, setAlert] = useState("");

    const register = e => {
        e.preventDefault();
        fetch(URL, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json'},
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                setStatus({...status, error: res.error});
                setAlert(res.message);
            }
            else {
                setStatus({...status, error: false});
            }
        });
    }

    if (status.error === true) {
        return (
            <div className="grid place-items-center">
                <form onSubmit={register}>
                    <div className="grid grid-rows-4 space-y-3 place-items-center -mt-52">
                        <label>{ alert }</label>
                        <label className="text-6xl">Register</label>
                        <input className="text-lg w-96 h-12 rounded-md pl-2"
                            type="text"
                            name="email"
                            value={ user.email }
                            placeholder= "Email"
                            onChange={e => setUser({ ...user, email: e.target.value })}
                        />
                        <input className="text-lg w-96 h-12 rounded-md pl-2"
                            type="text"
                            name="password"
                            value={ user.password }
                            placeholder= "Password"
                            onChange={e => setUser({ ...user, password: e.target.value })}
                        />
                        <button className="bg-blue-100 rounded-md px-5 pb-2 pt-3 text-xl mt-4" type="submit">Register</button>
                    </div>
                </form>
            </div>
        );
    }
    else {
        return (
            <Registered />
        );
    }
}

export function Registered() {
    const [redirect, setRedirect] = useState({
        now: false
    });

    useEffect(() => {
        setTimeout(() => {
            setRedirect({ ...redirect, now: true });
        }, 3000)
    })

    if (redirect.now) {
        return (
            <Redirect to="/login" />
        );
    }
    else {
        return (
            <div className="text-3xl max-w-5xl -mt-32">
                <label>Registration successful! Taking you to the to Login page...</label>
            </div>
        );
    }
}