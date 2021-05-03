import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Rankings from './components/Rankings';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <div className="block w-full h-screen overflow-hidden font-comfortaa">
        <Router>
          <div className="grid place-items-center mx-12">
            <Navbar/>
          </div>
          <div className="grid place-items-center mx-12 h-full">
            <Switch>
              <Route path="/home">
                <Home/>
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path="/rankings">
                <Rankings/>
              </Route>
              <Route path="/search">
                <Rankings/>
              </Route>
              <Route path="/factors">
                <Rankings/>
              </Route>
              <Route path="/register">
                <Register/>
              </Route>
              <Route path="/login">
                <Login/>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
