import React, { useState } from 'react';
import './App.css';
import TxtReader from './TxtReader'
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// import "primereact/resources/themes/bootstrap4-light-blue/theme.css";  //theme
// import "primereact/resources/primereact.min.css";                  //core css
// import "primeicons/primeicons.css";

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
    setFilamentLength(feet.toFixed(2))
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
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar margin={20}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}

            >
              GCODE File Helper v1.1
            </Typography>

          </Toolbar>
        </AppBar>

      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center">
        <Stack>
          <Box sx={{ mx: "auto" }} >
            <TxtReader style={{ display: "flex" }} getHotEndTemp={getHotEndTemp} getBedTemp={getBedTemp} setText={setText} getLayerCount={getLayerCount} getLength={getLength} />
            {/* 
              <Input type="file" variant="contained" color="primary" onChange={downloadTxtFile} /> */}
          </Box>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography>
                GCODE File Helper v1.1
              </Typography>
              <Typography>
                Update settings...
              </Typography>

              <p style={{ display: "flex" }}><label>Hot End Temp:</label>
                <Input style={{ display: "flex" }} value={hotEndTemp} onInput={e => setHotEndTemp(e.target.value)} /></p>
              <p style={{ display: "flex" }}><label>Bed Temp:</label>
                <Input style={{ display: "flex" }} value={bedTemp} onInput={e => setBedTemp(e.target.value)} /></p>
              <p style={{ display: "flex" }}>LayerCount: {layerCount}</p>
              <p style={{ display: "flex" }}>Filament in Feet: {filamentLength}</p>
            </CardContent>
            <Button style={{ display: "flex" }} onClick={getNewText}> Write File
            </Button>
            {/* <p>Text: {text}</p> */}
          </Card>
        </Stack>
      </Box>
    </>
  );
}

export default App;
