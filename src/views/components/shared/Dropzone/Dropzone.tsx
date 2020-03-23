import React from 'react';
import { useCallback } from 'react';
import { DropTargetMonitor } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import TargetBox from './TargetBox';

type Props = {
    hide?: boolean;
    height?: string;
    width?: string;
    handleDrop?: (payload: File[]) => void;
};

export function Dropzone({ hide, height, width, handleDrop }: Props) {
    const handleFileDrop = useCallback((_: any, monitor: DropTargetMonitor) => {
        if (monitor) {
            const files = monitor.getItem().files;
            if (handleDrop) {
                handleDrop(files);
            }
        }
    }, []);

    const style = {
        display: !hide ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: '50%',
    };

    return (
        <div style={style}>
            <DndProvider backend={Backend}>
                <TargetBox
                    onDrop={handleFileDrop}
                    height={height}
                    width={width}
                />
            </DndProvider>
        </div>
    );
}
