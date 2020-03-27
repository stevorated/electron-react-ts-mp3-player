import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
    className?: string;
    text: string;
    icon: ReactNode;
    onClick: () => void;
};

export function ExplorerBtn({ icon, text, onClick }: Props) {
    return (
        <ExplorerBtnContainer>
            {icon}
            <ExplorerBtnInner className="hoverable" onClick={onClick}>
                {text}
            </ExplorerBtnInner>
        </ExplorerBtnContainer>
    );
}

const ExplorerBtnContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    height: 1.8rem;
    width: 90%;
`;

const ExplorerBtnInner = styled.div`
    font-size: 12px;
    text-transform: uppercase;
`;
