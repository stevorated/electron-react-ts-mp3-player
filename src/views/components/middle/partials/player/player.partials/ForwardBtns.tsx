import React from 'react';
import styled from 'styled-components';
import { FaForward, FaFastForward } from 'react-icons/fa';

type Props = {
    disabled: boolean;
    size: string;
    nextsong: () => Promise<void>;
    forward: () => void;
};

export function ForwardBtns({ disabled, size, nextsong, forward }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return (
        <ContainerDiv>
            <Forward
                className={`btn ${className}`}
                size={size}
                style={{ marginRight: '10px' }}
                onClick={forward}
            />
            <FastForward
                className={`btn ${className}`}
                size={size}
                onClick={nextsong}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    margin: 0 5px;
`;

const Forward = styled(FaForward)`
    margin-right: 10px;
`;

const FastForward = styled(FaFastForward)``;
