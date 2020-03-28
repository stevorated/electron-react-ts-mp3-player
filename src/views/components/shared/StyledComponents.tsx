import styled, { css } from 'styled-components';

type Props = {
    disabled: boolean;
};

export const btnStyle = css`
    cursor: pointer;
    border-radius: 0px;
    text-decoration: none;
    margin: 0 5px;
    font-size: 12px;
    line-height: 19px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    letter-spacing: 3px;
    -webkit-transition: all 0.4s ease-in-out;
    -moz-transition: all 0.4s ease-in-out;
    -ms-transition: all 0.4s ease-in-out;
    -o-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
`;

export const disableable = ({ disabled }: Props) =>
    disabled &&
    css`
        cursor: default !important;
        color: rgba(245, 235, 179, 0.3);

        &:hover {
            color: rgba(245, 235, 179, 0.3);
        }
    `;

export const RangeInput = styled.input`
    -webkit-appearance: none;
    width: 100%;
    transition: all 0.4s ease;
    height: 5px;
    border-radius: 3px;
    margin: 7.3px 10px;

    ${({ disabled }: Props) =>
        disabled &&
        css`
            cursor: not-allowed !important;
            color: rgba(245, 235, 179, 0.3);

            &:hover {
                color: rgba(245, 235, 179, 0.3);
            }
        `}

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 11.4px;
        cursor: pointer;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: rgba(0, 0, 0, 0.55);
        border-radius: 1.3px;
        border: 0.2px solid #010101;
        ${({ disabled }: Props) =>
            disabled &&
            css`
                cursor: not-allowed !important;
                color: rgba(245, 235, 179, 0.3);

                &:hover {
                    color: rgba(245, 235, 179, 0.3);
                }
            `}
    }

    &::-webkit-slider-thumb {
        box-shadow: 0.9px 0.9px 1px #000031, 0px 0px 0.9px #00004b;
        border: 1.8px solid #00001e;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        border-color: black;
        background: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: 0;
        margin-left: 0;
        ${({ disabled }: Props) =>
            disabled &&
            css`
                cursor: not-allowed !important;
                color: rgba(245, 235, 179, 0.3);

                &:hover {
                    color: rgba(245, 235, 179, 0.3);
                }
            `}
    }

    &:focus::-webkit-slider-runnable-track {
        background: rgba(0, 0, 0, 0.4);
    }

    &:disabled::-webkit-slider-thumb {
        background: rgba(255, 255, 255, 0.2) !important;
    }
`;
