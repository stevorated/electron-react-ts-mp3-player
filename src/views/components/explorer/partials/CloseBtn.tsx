import React from 'react';
import { FaTimes } from 'react-icons/fa';

type Props = {
    id: number;
};

export function CloseBtn({ id }: Props) {
    return (
        <div
            onClick={() => {
                console.log('close ', id);
            }}
            className="stick-right hoverable-alt"
        >
            <FaTimes
                size="10px"
                style={{
                    marginRight: '20px',
                    marginBottom: '0',
                }}
            />
        </div>
    );
}
