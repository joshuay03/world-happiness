import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <div class="grid place-items-center mx-12">
        <Navbar/>
      </div>
      <div class="grid place-items-center mx-12 mt-8">
        <Home />
      </div>
    </div>
  );
}

export default App;
