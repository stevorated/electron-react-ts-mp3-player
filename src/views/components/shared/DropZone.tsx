import React from 'react';

type Props = {
    height?: string;
    width?: string;
};

export function DropZone({ height, width }: Props) {
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
