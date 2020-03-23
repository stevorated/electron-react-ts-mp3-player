import React from 'react';
import { Tab } from './Tab';
import { Select } from './Select';
import { Text } from './Text';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

type Props = {
    waitBetween: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => Promise<void>;
};

export function PlaybackPrefs({ waitBetween, handleAction }: Props) {
    const handleChangeWaitBetweenText = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        handleAction('CHANGE_WAIT_BETWEEN', e.target.value);
    };

    const handleChangeWaitBetween = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        e.preventDefault();
        handleAction('CHANGE_WAIT_BETWEEN', e.target.value);
    };

    return (
        <Tab title="Playback">
            <Text
                name="wait between"
                value={waitBetween}
                onChange={handleChangeWaitBetweenText}
            />
            <Select
                state={waitBetween}
                name="select 1"
                onChange={handleChangeWaitBetween}
                options={[
                    { title: 'take your time', value: 3 },
                    { title: 'half a second', value: 0.5 },
                    { title: 'back to back', value: 0 },
                ]}
            />
        </Tab>
    );
}
