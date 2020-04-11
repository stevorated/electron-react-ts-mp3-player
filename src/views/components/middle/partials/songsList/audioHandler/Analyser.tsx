import React, { useRef } from 'react';
import styled from 'styled-components';

import { Canvas } from './Canvas';
import { useWindowSize } from '../../../../../hooks';
import { CanvasType } from '@views/interfaces';

type Props = {
    canvasType: CanvasType;
    title?: string;
    panelWidth: number;
    size: number;
    totalDuration?: number;
    sinewaveC: React.RefObject<HTMLCanvasElement>;
    frequencyC: React.RefObject<HTMLCanvasElement>;
};

export function Analyser({ panelWidth, sinewaveC, frequencyC, canvasType }: Props) {
    const imageRef = useRef<HTMLDivElement>(null);
    const [windowWidth] = useWindowSize();

    const w = (windowWidth - panelWidth - (imageRef.current?.clientWidth || 0)) * 0.96;

    return (
        <div>
            <ContainerDiv>
                <Canvas display={canvasType} frequencyC={frequencyC} sinewaveC={sinewaveC} width={w} />
            </ContainerDiv>
        </div>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 160px;
`;
