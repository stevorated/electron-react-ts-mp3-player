import React from 'react';
import styled from 'styled-components';

type Props = {
    width?: string;
};

export function Hr({ width }: Props) {
    return <StyledHr style={{ margin: '12px auto', width }} />;
}

const StyledHr = styled.hr`
    height: 3px;
    border: 0;
    box-shadow: 0 10px 10px -10px #8c8b8b inset;
    color: @light-primary-color;
    background-color: @light-primary-color;
    margin: 12px auto;
    width: ${({ width }: { width?: string }) => width};
`;
