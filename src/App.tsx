import React, {useEffect} from 'react';
import './App.css';
import {start} from "./snake/app";

function App() {

    useEffect(() => {
        start()
    }, [])

  return (

      <canvas id="canvas" className="canvas__main" width={1400} height={700} >
      </canvas>


  );
}

export default App;
