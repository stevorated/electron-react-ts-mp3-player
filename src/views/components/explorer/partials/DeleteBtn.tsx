import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

type Props = {
    handleDelete: (temp: boolean) => void;
};

export function DeleteBtn({ handleDelete }: Props) {
    return (
        <ContainerDiv onClick={() => handleDelete(false)}>
            <FaTimes
                size="10px"
                style={{
                    marginRight: '1px',
                    marginBottom: '0',
                }}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    position: absolute;
    right: 1%;
    top: 0;
    &:hover {
        cursor: pointer;
        transform: translateY(-1px);
    }
`;
