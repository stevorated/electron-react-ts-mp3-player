import React, { useState, useEffect } from 'react';
import { FaCogs } from 'react-icons/fa';

import { AllHandlerActions } from '@views/interfaces';

import { Modal } from '../../../../shared';
import { useWindowSize } from '../../../../../hooks';
import { PlaybackPrefs } from './PlaybackPrefs';

import './preferences.style.less';

type Props = {
    statusClass: string;
    initialState?: boolean;
    waitBetween: number;
    handleAction: (
        action: AllHandlerActions,
        payload?: any
    ) => Promise<void>;
};

export function Preferences({
    statusClass,
    initialState = false,
    waitBetween,
    handleAction,
}: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(initialState);
    }, [initialState]);
    const toggle = () => {
        setOpen(!open);
    };

    const [width, height] = useWindowSize();
    return (
        <Modal
            top={10}
            left={width / 3}
            height={height * 0.22}
            width={width * 0.42}
            modalLabel="preferences"
            buttonText=""
            isOpen={open}
            handleClosing={() => {
                toggle();
                handleAction('SET_STATE', { isPrefsOpen: false });
            }}
            customStyles={{
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                overflow: 'hidden',
            }}
            button={
                <FaCogs
                    className={`btn action-icon ${statusClass}`}
                    style={{ bottom: '5px', left: '5px' }}
                    onClick={() => toggle()}
                />
            }
        >
            <div className="form-style">
                <PlaybackPrefs
                    waitBetween={waitBetween}
                    handleAction={handleAction}
                />
            </div>
        </Modal>
    );
}
