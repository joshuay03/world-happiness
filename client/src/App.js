import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Rankings from './components/Rankings';
import Factors from './components/Factors';
import Register from './components/Register';
import Login, { Logout } from './components/Login';
import Error from './components/Error';

function App() {
  return (
    <div className="App font-comfortaa mx-10">
      <div className="h-6" />
        <Router>
          <Switch>
            <Route path="/home">
              <Navbar />
              <div className="h-6" />
              <Home />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route path="/rankings">
              <Navbar />
              <div className="h-6" />
              <Rankings />
            </Route>
            <Route path="/search">
              <Navbar />
              <div className="h-6" />
              <Rankings />
            </Route>
            <Route path="/factors">
              <Navbar />
              <div className="h-6" />
              <Factors />
            </Route>
            <Route path="/register">
              <Navbar />
              <div className="h-6" />
              <Register />
            </Route>
            <Route path="/login">
              <Navbar />
              <div className="h-6" />
              <Login />
            </Route>
            <Route path="/logout">
              <Navbar />
              <div className="h-6" />
              <Logout />
            </Route>
            <Route path="/error">
              <Navbar />
              <div className="h-6" />
              <Error />
            </Route>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
