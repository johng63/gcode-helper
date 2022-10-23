import React, { useState } from 'react';
import './App.css';
import TxtReader from './TxtReader'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

function App() {
  const [hotEndTemp, setHotEndTemp] = useState(0);
  const [bedTemp, setBedTemp] = useState(0);
  const [layerCount, setLayerCount] = useState(0);
  const [text, setThisText] = useState('');
  const [filamentLength, setFilamentLength] = useState(0);

  const setText = (text) => {
    setThisText(text)
  }

  const getHotEndTemp = (heTemp) => {
    setHotEndTemp(heTemp)

  };

  const getBedTemp = (bTemp) => {
    setBedTemp(bTemp)

  };

  const getLayerCount = (lCount) => {
    setLayerCount(lCount)

  };

  const getLength = (meters) => {
    let feet = meters.replace('m', '') * 3.28084;
    setFilamentLength(feet)
  }

  const downloadTxtFile = (newText) => {
    const element = document.createElement("a");
    const file = new Blob([newText], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "NewGcodeFile.txt";
    document.body.appendChild(element);

    element.click();
  };


  const getNewText = () => {
    let newtext = '';
    const textlines = text.split(/\r\n|\n/);
    for (var line = 0; line < textlines.length - 1; line++) {


      if (textlines[line].startsWith('M104 S') && line < 40) {
        newtext += 'M104 S' + hotEndTemp;
      }
      else if (textlines[line].startsWith('M109 S') && line < 40) {
        newtext += 'M109 S' + hotEndTemp;
      }
      else if (textlines[line].startsWith('M140 S') && line < 40) {
        newtext += 'M140 S' + bedTemp;
      }
      else if (textlines[line].startsWith('M190 S') && line < 40) {
        newtext += 'M190 S' + bedTemp;
      }
      else {
        newtext += textlines[line];
      }
      newtext += '\r\n'

    }
    downloadTxtFile(newtext);
  };

  return (
    <div className="App">
      <Card title="GCODE File Helper v1.1" subTitle="Update settings." style={{ width: '25rem', marginBottom: '3em' }}>
        <p style={{ display: "flex" }}><label>Hot End Temp:</label>
          <InputText style={{ display: "flex" }} value={hotEndTemp} onInput={e => setHotEndTemp(e.target.value)} /></p>
        <p style={{ display: "flex" }}><label>Bed Temp:</label>
          <InputText style={{ display: "flex" }} value={bedTemp} onInput={e => setBedTemp(e.target.value)} /></p>
        <p style={{ display: "flex" }}>LayerCount: {layerCount}</p>
        <p style={{ display: "flex" }}>Filament in Feet: {filamentLength}</p>

        <TxtReader style={{ display: "flex" }} getHotEndTemp={getHotEndTemp} getBedTemp={getBedTemp} setText={setText} getLayerCount={getLayerCount} getLength={getLength} />
        <Button style={{ display: "flex" }} onClick={getNewText}> Write File
        </Button>
        {/* <p>Text: {text}</p> */}
      </Card>
    </div >
  );
}

export default App;
