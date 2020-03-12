import React, { ReactNode } from 'react';

type Props = {
    icon: ReactNode;
    text: string;
    onClick: () => void;
};

export function ExplorerBtn({ icon, text, onClick }: Props) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: '2.5rem',
                width: '90%',
            }}
        >
            {icon}
            <div
                className="hoverable"
                onClick={onClick}
                style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                }}
            >
                {text}
            </div>
        </div>
    );
}
