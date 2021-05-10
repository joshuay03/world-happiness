import { useState } from 'react';

export default function Register() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const URL = 'http://131.181.190.87:3000/user/register';
  const [registered, setRegistered] = useState(false);
  const [alert, setAlert] = useState('');

  const register = (e) => {
    setRegistered(false);
    e.preventDefault();
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(function(res) {
        if (res.status === 409) {
          setAlert('There is already a user with this email address');
        } else if (res.status === 400) {
          setAlert('Both email address and password are required');
        } else {
          setAlert('User has been registered');
          setRegistered(true);
        }
      });
  };

  return (
    <div className="mt-10">
      <form onSubmit={register}>
        <div className="h-auth grid grid-rows-5 place-items-center">
          <AlertLabel registered={registered} alert={alert} />
          <label className="text-6xl text-gray-200">Register</label>
          <input
            className="text-lg w-96 h-12 rounded-md pl-2"
            type="text"
            name="email"
            value={user.email}
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            className="text-lg w-96 h-12 rounded-md pl-2 -mt-14"
            type="text"
            name="password"
            value={user.password}
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button className="bg-blue-100 rounded-md px-5 pb-2 pt-3 text-xl -mt-16" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

function AlertLabel(props) {
  if (props.registered) {
    return (
      <label className="text-3xl text-green-600">{props.alert}</label>
    );
  } else {
    return (
      <label className="text-3xl text-red-600">{props.alert}</label>
    );
  }
}