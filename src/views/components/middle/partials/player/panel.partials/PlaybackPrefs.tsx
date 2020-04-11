import React from 'react';
import { Tab } from './Tab';
import { Select } from './Select';
import { AllHandlerActions } from '@views/interfaces';

type Props = {
    waitBetween: number;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function PlaybackPrefs({ waitBetween, handleAction }: Props) {
    const handleChangeWaitBetween = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        let val = 0;
        console.log(e.target.value);
        switch (e.target.value) {
            case '0.9':
                val = 0.9;
                break;

            case '0.4':
                val = 0.4;
                break;

            case '0':
                val = 0;
                break;

            default:
                break;
        }
        console.log(val);
        handleAction('CHANGE_WAIT_BETWEEN', val);
    };

    return (
        <Tab title="Playback">
            <Select
                state={waitBetween}
                name="wait between"
                onChange={handleChangeWaitBetween}
                options={[
                    { title: 'snail', value: '0.9' },
                    { title: 'fast', value: '0.4' },
                    { title: 'back to back', value: '0' },
                ]}
            />
        </Tab>
    );
}
