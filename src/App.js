import React, { useState } from 'react';
import './App.css';
import TxtReader from './TxtReader'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';


function App() {
  const [hotEndTemp, setHotEndTemp] = useState(0);
  const [bedTemp, setBedTemp] = useState(0);
  const [layerCount, setLayerCount] = useState(0);
  const [text, setThisText] = useState('');
  const [filamentLength, setFilamentLength] = useState(0);
  const [fileName, setFileName] = useState('NewFile.gcode');
  const [autoLevel, setAutoLevel] = useState(false);


  const setText = (text) => {
    setThisText(text);
  }
  const setFile = (fileName) => {
    setFileName(fileName)
  }

  const setData = (gcode_data) => {
    setHotEndTemp(gcode_data[0]);
    setBedTemp(gcode_data[1]);
    setLayerCount(gcode_data[2]);
    setFilamentLength(gcode_data[3]);
    setAutoLevel(gcode_data[4]);
  }


  const downloadTxtFile = (newText) => {
    const element = document.createElement("a");
    const file = new Blob([newText], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
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

    <Container maxWidth="xs">
      <Paper
        elevation={4}
        style={{
          padding: 8,
          border: "1px solid black"
        }}
      >
        <Stack spacing={1} justify="center">

          <Typography
            variant="h6"
            align="center"
            style={{
              backgroundColor: "lightblue"
            }}
          >
            GCODE File Helper v1.1
          </Typography>

          <TxtReader style={{ display: "flex" }} gcodeData={setData} setText={setText} setFileName={setFile} />

          <TextField
            label="Hotend Temp"

            value={hotEndTemp}
            onInput={e => setHotEndTemp(e.target.value)}

          />
          <TextField
            label="Bed Temp"

            value={bedTemp}
            onInput={e => setBedTemp(e.target.value)}

          />
          <TextField
            label="Layer Count"

            value={layerCount}

          />
          <TextField
            label="Filament Length in Feet"
            value={filamentLength}

          />
          <FormControlLabel
            control={<Checkbox
              checked={autoLevel}

            />}
            label="AutoBed Leveling"
          />

          <Button style={{ display: "flex" }} onClick={getNewText}> Write Changes to New File
          </Button>

        </Stack>
      </Paper>

    </Container >


  );
}

export default App;
