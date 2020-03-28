import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { colors } from '../../../../assets/consts';
import img from '../../../../assets/img/Record-Album-02.jpg';
import { Analyser } from '..';

type Props = {
    title?: string;
    size: number;
    totalDuration?: number;
    context: AudioContext | null;
    source: MediaElementAudioSourceNode | null;
};

export function PlaylistDetailsBar({
    title,
    size,
    totalDuration,
    source,
    context,
}: Props) {
    return (
        <div style={{ display: 'flex' }}>
            <ContainerDiv>
                <ImageDiv>
                    <Image src={img} alt={title} />
                </ImageDiv>
                <Title>
                    <TextContainer>{title}</TextContainer>
                    <TextContainer>
                        <SmallTitle>{size} songs</SmallTitle>
                    </TextContainer>
                    <TextContainer>
                        <SmallTitle>
                            {totalDuration
                                ? dayjs(totalDuration).format('mm:ss')
                                : '--:--'}
                        </SmallTitle>
                    </TextContainer>
                </Title>
            </ContainerDiv>
            <Analyser source={source} context={context} />
        </div>
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

const SmallTitle = styled.small`
    color: ${colors.mediumTextColor};
    padding-top: 0;
    /* padding-left: 6px; */
    font-size: 10px;
    text-align: 'start';
`;

const TextContainer = styled.div`
    margin: 4px 0;
    display: flex;
    justifyself: start;
    alignitems: floor;
`;
