import React from 'react';
import { FaFastBackward, FaBackward } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
    disabled: boolean;
    size: string;
    lastsong: () => void;
    rewind: () => void;
};

export function BackBtns({ disabled, size, rewind, lastsong }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return (
        <Containerdiv>
            <FaFastBackward
                className={`btn ${className}`}
                size={size}
                onClick={!disabled ? lastsong : () => {}}
            />
            <FaBackward
                className={`btn ${className}`}
                size={size}
                style={{ marginLeft: '10px' }}
                onClick={!disabled ? rewind : () => {}}
            />
        </Containerdiv>
    );
}

const Containerdiv = styled.div`
    alignitems: center;
    margin: 0 5px;
`;
