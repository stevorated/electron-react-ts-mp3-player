import React from 'react';

import './Status.style.less';

type Props = {
    status: string;
};

export function Status({ status }: Props) {
    return (
        <footer>
            <div className="app-git">
                <ul>
                    <li>
                        <i className="fa fa-github"></i> {status}
                    </li>
                    <li>
                        <i className="fa fa-times-circle"></i> 0
                    </li>
                    <li>
                        <i className="fa fa-warning"></i> 0
                    </li>
                </ul>
            </div>
            <div className="app-encoding">
                <ul>
                    <li>UTF-8</li>
                    <li>HTML</li>
                    <li>
                        <i className="fa fa-smile-o"></i>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Status;
