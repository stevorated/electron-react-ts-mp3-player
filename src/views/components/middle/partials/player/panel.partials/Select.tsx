import React from 'react';
import styled from 'styled-components';

type Option = {
    title: string;
    value?: any;
};

type Props = {
    state: any;
    name: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function Select({ name, options, onChange, state }: Props) {
    const renderOptions = () =>
        options.map(({ title, value }, index) => (
            <option key={index} value={value === 0 ? 0 : value || title}>
                {title} - {value}
            </option>
        ));

    return (
        <label htmlFor={name}>
            <span>{name}</span>
            <SelectOption
                value={state}
                onChange={onChange}
                name={name}
                className="select-field"
            >
                {renderOptions()}
            </SelectOption>
        </label>
    );
}

const SelectOption = styled.select``;
