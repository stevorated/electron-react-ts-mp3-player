import React from 'react';
import { FaMagic, FaSmile, FaList, FaSnowman } from 'react-icons/fa';

import { TreeListType } from '@views/interfaces';

import './Status.style.less';

type Props = {
    status: string;
    pointer: number;
    current?: TreeListType;
};

export function Status({ status, current, pointer }: Props) {
    return (
        <footer>
            <div className="status-bar">
                <ul>
                    <li style={{ display: 'flex', alignItems: 'base' }}>
                        <FaSmile size="14px" style={{ marginRight: '6px' }} />
                        status: {status}
                    </li>
                    <li style={{ display: 'flex', alignItems: 'base' }}>
                        <FaSnowman size="12px" style={{ marginRight: '6px' }} />{' '}
                        {current?.title}
                    </li>
                    <li style={{ display: 'flex', alignItems: 'base' }}>
                        <FaList size="12px" style={{ marginRight: '6px' }} />{' '}
                        {current?.nested?.length || '-'}
                    </li>
                    <li
                        style={{
                            display: 'inline',
                            alignItems: 'base',
                            float: 'left',
                        }}
                    >
                        <FaMagic
                            size="12px"
                            style={{
                                marginRight: '6px',
                            }}
                        />{' '}
                        {current?.nested?.[pointer]?.title}
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Status;

// {current?.songs?.[pointer]}
