import React from 'react';
import styled from 'styled-components';

import {
    IoIosVolumeHigh,
    IoIosVolumeLow,
    IoIosVolumeMute,
} from 'react-icons/io';

type Props = {
    disabled: boolean;
    width: number;
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
    width,
}: Props) {
    const currentVolume = player?.volume;
    if (currentVolume && currentVolume !== volume) {
        setVolume(currentVolume);
    }

    const VolumeIcon = ({
        style,
        size,
        className,
    }: {
        style: object;
        size: string;
        className: string;
    }) =>
        volume > 0.5 ? (
            <IoIosVolumeHigh size={size} style={style} className={className} />
        ) : volume === 0 ? (
            <IoIosVolumeMute size={size} style={style} className={className} />
        ) : (
            <IoIosVolumeLow size={size} style={style} className={className} />
        );
    return (
        <ContainerDiv>
            <VolumeIcon
                className={`${disabled ? 'disabled' : 'slider'}`}
                size="30px"
                style={{ marginRight: '5px', transition: 'all 0.4s ease' }}
            />
            <input
                disabled={disabled}
                type="range"
                max={100}
                value={(currentVolume && currentVolume * 100) || volume}
                onChange={handleChangeVolume}
                style={{
                    // width: `${width * 0.09}px`,
                    height: '5px',
                }}
                className={`${disabled ? 'disabled' : 'slider'}`}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    transition: all 0.4s ease;
    flex: 1;
`;
