import React from 'react';

type Props = {
    width?: string;
};

export function Hr({ width }: Props) {
    return <hr className="hr" style={{ margin: '12px auto', width }} />;
}
