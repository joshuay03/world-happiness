import { Link } from 'react-router-dom';

export default function Navbar() {
  const currentURL = window.location.pathname;
  const loggedIn = localStorage.getItem('token') !== null;

  return (
    <div className="grid grid-cols-3 w-full bg-gray-200 rounded-lg">
      <ul className="inline-flex space-x-4 list-none py-2 pl-10">
        <RankingsButton currentURL={currentURL} />
        <FactorsButton currentURL={currentURL} />
        <SearchButton currentURL={currentURL} />
      </ul>
      <div className="grid place-items-center w-full h-full">
        <ul className="list-none py-2">
          <HomeButton currentURL={currentURL} />
        </ul>
      </div>
      <ul className="inline-flex space-x-4 list-none pt-2 pb-2 justify-end pr-10">
        <RegisterButton currentURL={currentURL} />
        <LoginButton loggedIn={loggedIn} currentURL={currentURL} />
        <LogoutButton loggedIn={loggedIn} />
      </ul>
    </div>
  );
}

export function RankingsButton(props) {
  if (props.currentURL === '/rankings') {
    return (
      <li className="bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/rankings">Rankings</Link>
      </li>
    );
  } else {
    return (
      <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/rankings">Rankings</Link>
      </li>
    );
  }
}

export function FactorsButton(props) {
  if (props.currentURL === '/factors') {
    return (
      <li className="bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/factors">Factors</Link>
      </li>
    );
  } else {
    return (
      <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/factors">Factors</Link>
      </li>
    );
  }
}

export function SearchButton(props) {
  if (props.currentURL === '/search') {
    return (
      <li className="bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/search">Search</Link>
      </li>
    );
  } else {
    return (
      <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/search">Search</Link>
      </li>
    );
  }
}

export function HomeButton(props) {
  if (props.currentURL === '/home') {
    return (
      <li className="bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/home">Home</Link>
      </li>
    );
  } else {
    return (
      <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/home">Home</Link>
      </li>
    );
  }
}

export function RegisterButton(props) {
  if (props.currentURL === '/register') {
    return (
      <li className="bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/register">Register</Link>
      </li>
    );
  } else {
    return (
      <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
        <Link to="/register">Register</Link>
      </li>
    );
  }
}

export function LoginButton(props) {
  if (!props.loggedIn) {
    if (props.currentURL === '/login') {
      return (
        <li className="bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/login">Login</Link>
        </li>
      );
    } else {
      return (
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/login">Login</Link>
        </li>
      );
    }
  } else {
    return (
      <li className="text-gray-500 rounded-lg px-3 py-1">
        Login
      </li>
    );
  }
}

export function LogoutButton(props) {
  if (!props.loggedIn) {
    return (
      <li className="text-gray-500 rounded-lg px-3 py-1">
        Logout
      </li>
    );
  } else {
    return (
      <li className="hover:bg-gray-500 rounded-lg px-3 py-1">
        <Link to="/logout">Logout</Link>
      </li>
    );
  }
}