import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="grid grid-cols-3 w-full mt-5 bg-gray-200 rounded-lg">
      <ul className="inline-flex space-x-4 list-none py-2 pl-10">
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/rankings">Rankings</Link>
        </li>
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/search">Search</Link>
        </li>
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/factors">Factors</Link>
        </li>
      </ul>
      <div className="grid place-items-center w-full h-full">
        <ul className="list-none py-2">
          <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
            <Link to="/home">Home</Link>
          </li>
        </ul>
      </div>
      <ul className="inline-flex space-x-4 list-none pt-2 pb-2 justify-end pr-10">
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/register">Register</Link>
        </li>
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/login">Login</Link>
        </li>
        <li className="hover:bg-gray-300 rounded-lg px-3 py-1">
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}