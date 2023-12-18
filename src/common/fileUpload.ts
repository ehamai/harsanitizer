import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { HarFile } from "../sanitizer/models/harFile";
import { SanitizationCategories, sanitize } from "../sanitizer/sanitizer";
const JSZip = require('jszip');

const readFileContent = (file: File) => {
    const reader = new FileReader()
    return new Promise<string>((resolve, reject) => {
        reader.onload = event => {
            let content = event.target && event.target.result as string;
            if (!content) {
                content = '{}';
            }
            resolve(content);
        }
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

export const getOutputFileNamePrefix = (inputFileName: string) => {
    const parts = inputFileName.split('.har');
    if (parts.length === 2) {
        return `${parts[0]}.sanitized`;
    }

    return 'sanitized';
}

export const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>,
    sanitizationCategories: SanitizationCategories,
    setFileName: React.Dispatch<React.SetStateAction<string>>,
    setDownloadUrl: React.Dispatch<React.SetStateAction<string>>,
    setSanitizedFileJson: React.Dispatch<React.SetStateAction<HarFile | null>>,
    appInsights: ReactPlugin) => {

    const input = event.target
    if (input.files && input.files.length > 0) {
        await sanitizeAndCompressFile(
            input.files[0],
            sanitizationCategories,
            setFileName,
            setDownloadUrl,
            setSanitizedFileJson,
            appInsights);
    }
}

export const sanitizeAndCompressFile = async (
    file: File,
    sanitizationCategories: SanitizationCategories,
    setFileName: React.Dispatch<React.SetStateAction<string>>,
    setDownloadUrl: React.Dispatch<React.SetStateAction<string>>,
    setSanitizedFileJson: React.Dispatch<React.SetStateAction<HarFile | null>>,
    appInsights: ReactPlugin) => {

    const fileNamePrefix = getOutputFileNamePrefix(file.name);
    setFileName(`${fileNamePrefix}.zip`);
    let parsedContent: HarFile;

    try {
        const content = await readFileContent(file)
        parsedContent = JSON.parse(content) as HarFile;
        sanitize(parsedContent, sanitizationCategories, appInsights);
        setSanitizedFileJson(parsedContent)
    }
    catch (e: any){
        appInsights.trackException({
            id: 'parseFileFailure',
            exception: e
        });

        throw e;
    }

    try{
        const zip = new JSZip();
        zip.file(`${fileNamePrefix}.har`, JSON.stringify(parsedContent));
        const blob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        })

        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
    } catch (e: any) {
        appInsights.trackException({
            id: 'zipFailure',
            exception: e
        })
    }
}
