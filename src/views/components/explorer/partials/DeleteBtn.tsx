import React from 'react';
import { FaTimes } from 'react-icons/fa';

type Props = {
    handleDelete: (temp: boolean) => void;
};

export function DeleteBtn({ handleDelete }: Props) {
    return (
        <div
            onClick={() => handleDelete(false)}
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
