import React, { useRef } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { colors } from '../../../../assets/consts';
import img from '../../../../assets/img/Record-Album-02.jpg';

type Props = {
    title?: string;
    size: number;
    totalDuration?: number;
};

export function PlaylistDetailsBar({ title, size, totalDuration }: Props) {
    const imageRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            <ContainerDiv>
                <ImageDiv ref={imageRef}>
                    <Image src={img} alt={title} />
                </ImageDiv>
                <Title>
                    <TextContainer>{title}</TextContainer>
                    <TextContainer>
                        <SmallTitle>{size} songs</SmallTitle>
                    </TextContainer>
                    <TextContainer>
                        <SmallTitle>{totalDuration ? dayjs(totalDuration).format('mm:ss') : '--:--'}</SmallTitle>
                    </TextContainer>
                </Title>
            </ContainerDiv>
        </div>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 110px;
`;

const ImageDiv = styled.div`
    display: flex;
    height: 100px;
    width: 100px;
    margin: 3px;
    border: 2px dashed rgba(200, 200, 200, 0.2);
    align-items: center;
    justify-content: center;
`;

const Image = styled.img`
    display: flex;
    height: 100px;
    width: 100px;
    padding: 0;
    margin: 2px;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h3`
    color: ${colors.lightTextColor};
    margin-left: 20px;
    font-size: 1rem;
    text-align: center;
    display: block;
    text-align: flex-start;
    flex: 1;
`;

const SmallTitle = styled.small`
    color: ${colors.mediumTextColor};
    padding-top: 0;
    /* padding-left: 6px; */
    font-size: 10px;
    text-align: flex-start;
`;

const TextContainer = styled.div`
    margin: 4px 0;
    display: flex;
    width: 50px;
    justify-self: start;
    align-items: floor;
`;
