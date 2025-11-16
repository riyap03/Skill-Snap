
// import {Routes,Route} from "react-router-dom";

// import Home from './pages/Home';
// import Roadmap from "./pages/RoadMap";
// import Portfolio from './pages/Portfolio';
// import Navbar from './components/Navbar';


// function App() {
 

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/Roadmap" element={<Roadmap />} />
//         <Route path="/Portfolio" element={<Portfolio />} />
//       </Routes>
//     </>
//   )
// }

// export default App

import Home from './pages/Home';
import Roadmap from "./pages/RoadMap";
import Portfolio from './pages/Portfolio';
import Navbar from './components/Navbar';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, } from "react-router-dom";


 function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </>
  );
}




export default App ;
 
