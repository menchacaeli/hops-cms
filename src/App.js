import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import HopsDrawer from "./components/HopsDrawer.js";

function App() {
  return (
    <Router>
      <HopsDrawer />
    </Router>
  );
}

export default App;
