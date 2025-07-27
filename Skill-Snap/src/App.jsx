
import {Routes,Route} from "react-router-dom";

import Home from './pages/Home';
import Roadmap from "./pages/RoadMap";
import Portfolio from './pages/Portfolio';
import Navbar from './components/Navbar';


function App() {
 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Roadmap" element={<Roadmap />} />
        <Route path="/Portfolio" element={<Portfolio />} />
      </Routes>
    </>
  )
}

export default App
