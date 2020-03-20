import React from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

type Props = {
    status: string;
    active: boolean;
    size: string;
    iconClassName: string;
};

export function SongPlayBtn({ status, active, size, iconClassName }: Props) {
    return status === 'playing' && active ? (
        <FaPauseCircle
            size={size}
            className={`${iconClassName} hoverable round`}
        />
    ) : (
        <FaPlayCircle
            size={size}
            className={`${iconClassName} hoverable round`}
        />
    );
}
