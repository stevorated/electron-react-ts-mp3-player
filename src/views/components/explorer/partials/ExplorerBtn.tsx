import React, { ReactNode } from 'react';

type Props = {
    className?: string;
    text: string;
    icon: ReactNode;
    onClick: () => void;
};

export function ExplorerBtn({ icon, text, onClick }: Props) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '10px',
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
