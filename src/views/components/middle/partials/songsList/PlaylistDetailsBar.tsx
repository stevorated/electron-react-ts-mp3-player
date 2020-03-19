import React from 'react';
import styled from 'styled-components';

import { colors } from '../../../../assets/styles/consts';
import img from '../../../../assets/img/Record-Album-02.jpg';

type Props = {
    title?: string;
    size: number;
};

export function PlaylistDetailsBar({ title, size }: Props) {
    return (
        <ContainerDiv>
            <ImageDiv>
                <Image src={img} alt="" />
            </ImageDiv>
            <Title>
                {title}
                <small className="tiny-text">{size} songs</small>
            </Title>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    margin: 20px;
    display: flex;
    flexdirection: row;
`;

const ImageDiv = styled.div`
    display: flex;
    height: 14vh;
    width: 14vh;
    border: 2px dashed rgba(200, 200, 200, 0.2);
    alignitems: center;
    justifycontent: center;
`;

const Image = styled.img`
    display: flex;
    height: 14vh;
    width: 14vh;
    padding: 0;
    margin: 0;
    alignitems: censter;
    justifycontent: center;
`;

const Title = styled.h3`
    color: ${colors.lightTextColor};
    margin-left: 20px;
    padding: 10px;
    font-size: 1rem;
    text-align: center;
`;
