import React from 'react';
import './Spinner.css';
import Navbar from './Components/Navbar/Navbar';


function Spinner() {
  return (
    <div>
      <Navbar /> {/* Add the Navbar component here */}
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">Medical AID in development</p>
        <p className="spinner-text">Si ves esta ventana, esta vista pronto sera agregada! </p> 
      </div>
    </div>
  );
}

export default Spinner;
