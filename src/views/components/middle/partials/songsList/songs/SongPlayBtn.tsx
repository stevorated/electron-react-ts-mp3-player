import React from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

import { StatusType } from '@views/interfaces';

type Props = {
    status: StatusType;
    active: boolean;
    size: string;
    iconClassName: string;
};

export function SongPlayBtn({ status, active, size, iconClassName }: Props) {
    return (status === 'playing' || status === 'waiting...') && active ? (
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
