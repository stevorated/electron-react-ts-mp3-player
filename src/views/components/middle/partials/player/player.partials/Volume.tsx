import React from 'react';
import styled from 'styled-components';

import { RangeInput, disableable, Tooltip } from '../../../../shared';

import {
    IoIosVolumeHigh,
    IoIosVolumeLow,
    IoIosVolumeMute,
} from 'react-icons/io';

type Props = {
    disabled: boolean;
    volume: number;
    player: HTMLMediaElement | null;
    handleChangeVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setVolume: (value: number) => void;
};

export function Volume({
    setVolume,
    volume,
    player,
    handleChangeVolume,
    disabled,
}: Props) {
    const currentVolume = player?.volume;
    if (currentVolume && currentVolume !== volume) {
        setVolume(currentVolume);
    }

    const VolumeIcon = ({
        style,
        size,
        className,
        disabled,
    }: {
        style: object;
        size: string;
        className?: string;
        disabled: boolean;
    }) =>
        volume > 0.5 ? (
            <StyledHigh
                disabled={disabled}
                size={size}
                style={style}
                className={className}
            />
        ) : volume === 0 ? (
            <StyledMute
                disabled={disabled}
                size={size}
                style={style}
                className={className}
            />
        ) : (
            <StyledLow
                disabled={disabled}
                size={size}
                style={style}
                className={className}
            />
        );

    const tooltipText = `${Math.round(
        (currentVolume || 0) * 100
    )?.toString()}%`;

    return (
        <ContainerDiv>
            <Tooltip
                tooltipText={tooltipText}
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                }}
            >
                <VolumeIcon
                    disabled={disabled}
                    size="30px"
                    style={{ marginRight: '5px', transition: 'all 0.4s ease' }}
                />
                <RangeInput
                    disabled={disabled}
                    type="range"
                    max={100}
                    value={(currentVolume && currentVolume * 100) || volume}
                    onChange={handleChangeVolume}
                />
            </Tooltip>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
    width: 18%;
    /* flex: 0.8; */
`;

const StyledHigh = styled(IoIosVolumeHigh)`
    ${disableable}
`;

const StyledMute = styled(IoIosVolumeMute)`
    ${disableable}
`;

const StyledLow = styled(IoIosVolumeLow)`
    ${disableable}
`;
