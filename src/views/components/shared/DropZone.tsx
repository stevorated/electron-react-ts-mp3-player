import React from 'react';
// import { useDropzone } from 'react-dropzone';

type Props = {
    height?: string;
    width?: string;
};

export function DropZone({ height, width }: Props) {
    // const onDrop = useCallback(acceptedFiles => {
    //     acceptedFiles.forEach((file: any) => {
    //         const reader = new FileReader();

    //         reader.onabort = () => console.log('file reading was aborted');
    //         reader.onerror = () => console.log('file reading has failed');
    //         reader.onload = () => {
    //             // Do whatever you want with the file contents
    //             const binaryStr = reader.result;
    //             console.log(binaryStr);
    //         };
    //         reader.readAsArrayBuffer(file);
    //     });
    // }, []);
    // const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
        <div
            style={{
                display: 'flex',
                height: height ?? '20vh',
                width: width ?? '',
                border: '2px dashed rgba(200, 200, 200, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h3>Drop Here?</h3>
        </div>
    );
}
