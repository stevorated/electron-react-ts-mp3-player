import React, { ReactNode } from 'react';

type Props = {
    icon: ReactNode;
    text: string;
    onClick: () => void;
};

export function ExplorerBtn({ icon, text, onClick }: Props) {
    return (
        <div
            className="hoverable"
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: '2.5rem',
                width: '100%',
            }}
            onClick={onClick}
        >
            {icon}
            <h5
                style={{
                    textTransform: 'uppercase',
                }}
            >
                {text}
            </h5>
        </div>
    );
}
