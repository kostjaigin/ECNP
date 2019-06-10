import React from 'react';
import ECNP from './ECNP.js'
import './App.css';

function App() {
  return (
    <div >
      <ECNP arraySize={20} resourceSpawnThreshold={0.02}/>
    </div>
  );
}

export default App;
