import { readFile, writeFile } from 'node:fs';
import { sanitize } from './sanitizer/sanitizer';

readFile('./harFiles/DCContainerUpdates.har', 'utf8', (err, content) =>{
    try{
        const json = JSON.parse(content);
        sanitize(json);
        console.log('success');

        writeFile('./out.har', JSON.stringify(json), (err) =>{
            if(err){
                console.log('failed to save file');
            } else{
                console.log('succeeded');
            }

        })
    } catch(e){
        console.log('Failed to parse HAR file: ' + e);
    }
})