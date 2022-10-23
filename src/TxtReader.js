
import { InputText } from 'primereact/inputtext';

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

const TxtReader = ({ getHotEndTemp, getBedTemp, setText, getLayerCount, getLength }) => {

    const getFileData = async (file) => {


        const reader = new FileReader();
        reader.onload = async function (e) {
            setText(e.target.result)
            const textlines = e.target.result.split(/\r\n|\n/);
            for (var line = 0; line < textlines.length - 1; line++) {
                if (textlines[line].startsWith('M104 S') && line < 40) {
                    getHotEndTemp(textlines[line].replace('M104 S', ''));
                }
                if (textlines[line].startsWith('M140 S') && line < 40) {
                    getBedTemp(textlines[line].replace('M140 S', ''));
                }
                if (textlines[line].startsWith(';LAYER_COUNT:')) {
                    getLayerCount(textlines[line].replace(';LAYER_COUNT:', ''));
                }
                if (textlines[line].startsWith(';Filament used:')) {
                    getLength(textlines[line].replace(';Filament used: ', ''));
                }
                //console.log(line + " --> "+ textlines[line]);  ;LAYER_COUNT:15
            }

        }
        reader.readAsText(file);
    }

    return (

        <InputText
            type='file'
            accept='.gcode'
            id='txtFile'
            onChange={(e) => {
                getFileData(e.target.files[0])
            }}
        >
        </InputText>


    );

}

export default TxtReader;