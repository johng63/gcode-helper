
import TextField from '@mui/material/TextField';

const TxtReader = ({ gcodeData, setText, setFileName }) => {

    const getFileData = async (file) => {

        let filament_length = 0;
        let layer_count = 0;
        let hotend_temp = 0;
        let bed_temp = 0;
        let Autolevel = false;

        const reader = new FileReader();
        reader.onload = async function (e) {
            //Set text of file
            setText(e.target.result)

            setFileName(file.name)

            //Get specific gcode data
            const textlines = e.target.result.split(/\r\n|\n/);
            for (var line = 0; line < textlines.length - 1; line++) {
                if (textlines[line].startsWith(';Filament used:')) {
                    let meters = textlines[line].replace(';Filament used: ', '');
                    filament_length = meters.replace('m', '') * 3.28084;
                }
                if (textlines[line].startsWith(';LAYER_COUNT:')) {
                    layer_count = textlines[line].replace(';LAYER_COUNT:', '');
                }
                if (textlines[line].startsWith('M140 S') && line < 40) {
                    bed_temp = textlines[line].replace('M140 S', '');
                }
                if (textlines[line].startsWith('M104 S') && line < 40) {
                    hotend_temp = textlines[line].replace('M104 S', '');
                }
                if (textlines[line].startsWith('G29') && line < 40) {
                    Autolevel = true;
                }


            }

            gcodeData([hotend_temp, bed_temp, layer_count, filament_length.toFixed(2), Autolevel]);

        }
        reader.readAsText(file);
    }

    return (

        <TextField
            type="file"
            variant='outlined'
            onChange={(e) => {
                getFileData(e.target.files[0])
            }}
        >
            Browse File
        </TextField>

    );

}

export default TxtReader;