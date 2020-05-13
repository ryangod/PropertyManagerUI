import React from 'react';
import './App.css';
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"
import {PropertyManager} from "./property-manager/property-manager";

function App() {
  return (
    <div className="App">

      <PropertyManager/>

    </div>
  );
}

export default App;
