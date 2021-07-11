import React, {useEffect} from 'react';
import './App.css';
import {start} from "./snake/app";

function App() {

    useEffect(() => {
        start()
    }, [])

  return (

      <canvas id="canvas" width={1200} height={900}>
      </canvas>


  );
}

export default App;
