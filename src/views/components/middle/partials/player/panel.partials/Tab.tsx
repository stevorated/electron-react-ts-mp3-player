import React from 'react';

type Props = {
    title: string;
    children?: JSX.Element[] | JSX.Element;
};

export function Tab({ title, children }: Props) {
    return (
        <fieldset>
            <legend>{title}</legend>
            {children}
        </fieldset>
    );
}
