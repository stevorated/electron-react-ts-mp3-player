import React, { useState, useEffect } from 'react';
import { FaCogs } from 'react-icons/fa';

import { AllHandlerActions, FftSizes, CanvasType } from '@views/interfaces';

import { Modal } from '../../../../shared';
import { useWindowSize } from '../../../../../hooks';
import { PlaybackPrefs } from './PlaybackPrefs';
import { AnalyserPrefs } from './AnalyserPrefs';

import './preferences.style.less';

type Props = {
    statusClass: string;
    initialState?: boolean;
    waitBetween: number;
    fftSize: FftSizes;
    canvasType: CanvasType;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function PreferencesBtn({
    statusClass,
    initialState = false,
    waitBetween,
    fftSize,
    canvasType,
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
            height={height}
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
                background: 'rgba(0, 0, 0, 0.5)',
                boxShadow: 'inset 0 0 10px #000000',
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
                <PlaybackPrefs waitBetween={waitBetween} handleAction={handleAction} />
                <AnalyserPrefs fftSize={fftSize} canvasType={canvasType} handleAction={handleAction} />
            </div>
        </Modal>
    );
}
