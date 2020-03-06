import React from 'react';

type Props = {
    status: string;
};

export function Info({ status }: Props) {
    return <aside className="flexbox-item-grow info-sidebar hide">info</aside>;
}
