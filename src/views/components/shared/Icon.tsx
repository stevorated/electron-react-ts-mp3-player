import React, { FunctionComponent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
    icon: IconProp;
    style: object;
};

export const Icon: FunctionComponent<Props> = ({ icon, style }) => {
    return (
        <FontAwesomeIcon
            className="hoverable"
            icon={icon}
            style={{
                borderRadius: '10%',
                position: 'absolute',
                display: 'inline-block',
                boxShadow: '0px 0px 2px #888',
                padding: '0.6em 0.7em',
                ...style,
            }}
        />
    );
};

export default Icon;
