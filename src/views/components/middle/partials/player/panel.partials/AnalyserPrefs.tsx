import React from 'react';
import { Tab } from './Tab';
import { Select } from './Select';
import { AllHandlerActions, CanvasType, FftSizes } from '@views/interfaces';

type Props = {
    canvasType?: CanvasType;
    fftSize?: FftSizes;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function AnalyserPrefs({ canvasType, fftSize, handleAction }: Props) {
    const handleOnChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        handleAction('SET_STATE', { loading: true });
        console.log({ canvasType, fftSize, handleAction });

        let key = '';

        switch (e.target.name) {
            case 'animation type':
                key = 'canvas_type';
                break;
            case 'fft':
                key = 'fft_size';
                break;
            default:
                break;
        }

        console.log({ [key]: e.target.value });

        await handleAction('UPDATE_REMOTE_STATE', { [key]: e.target.value });
        await handleAction('RELOAD_PLAYLIST');
        // handleAction('UPDATE_REMOTE_STATE', {[]:e.target.value});
    };

    return (
        <Tab title="Playback">
            <Select
                key="canvasType"
                state={canvasType}
                name="animation type"
                onChange={handleOnChange}
                options={[
                    { title: 'sinewave', value: 'sine' },
                    { title: 'frequency', value: 'freq' },
                ]}
            />

            <Select
                state={fftSize}
                name="fft"
                onChange={handleOnChange}
                options={[
                    { title: '128', value: '128' },
                    { title: '256', value: '256' },
                    { title: '512', value: '512' },
                    { title: '1024', value: '1024' },
                    { title: '2048', value: '2048' },
                    { title: '4096', value: '4096' },
                    { title: '8192', value: '8192' },
                    { title: '16384', value: '16384' },
                    { title: '32768', value: '32768' },
                ]}
            />
        </Tab>
    );
}
