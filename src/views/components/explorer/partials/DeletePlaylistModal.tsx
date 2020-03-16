import React from 'react';
import { Hr } from '../../shared';
import styled from 'styled-components';

type Props = {
    handleDelete: () => void;
    closeModal: () => void;
    title: string;
    size: number;
};

export default function DeletePlaylistModal({
    handleDelete,
    closeModal,
    title,
    size,
}: Props) {
    return (
        <CenteredTextDiv>
            <h2>Confirm Delete</h2>
            <Hr />
            <CenteredTextDiv>
                <h4>
                    You are about to delete "{title}"<br />({size} songs)
                </h4>
            </CenteredTextDiv>
            <h4 className="uppercase">this cannot be reversed</h4>
            <NoButton className="btn btn-white" onClick={closeModal}>
                No
            </NoButton>
            <StickRight>
                <button className="btn btn-danger" onClick={handleDelete}>
                    Yes
                </button>
            </StickRight>
        </CenteredTextDiv>
    );
}

const CenteredTextDiv = styled.div`
    align-text: center;
`;

const NoButton = styled.button`
    position: absolute;
    left: 20px;
    bottom: 20px;
    &:hover {
        font-weight: 700;
    }
`;

const StickRight = styled.div`
    position: absolute;
    right: 20px;
    bottom: 20px;
`;
