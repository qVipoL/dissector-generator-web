import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RootNavigator from './navigation/RootNavigator'

export default function App() {
  return (
    <div className="App">
      <Router>
        <RootNavigator />
      </Router>
    </div>
  );
};