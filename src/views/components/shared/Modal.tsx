import React, { ReactNode, useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import styled, { CSSObject } from 'styled-components';

import { ExplorerBtn } from '../explorer/partials/ExplorerBtn';

type Props = {
    modalLabel: string;
    buttonText: string;
    modalTitle?: string;
    buttonIcon?: ReactNode;
    children?: ReactNode;
    button?: ReactNode;
    handleAfterModal?: () => void;
    isOpen?: boolean;
    handleClosing?: () => void;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    customStyles?: CSSObject;
};

ReactModal.setAppElement('#root');

export function Modal({
    children,
    modalLabel,
    modalTitle,
    buttonText,
    button,
    handleAfterModal,
    handleClosing,
    isOpen,
    buttonIcon,
    top,
    left,
    width,
    height,
    customStyles,
}: Props) {
    const [modalIsOpen, setIsOpen] = useState(false);

    const topS = `${top}px`;
    const leftS = `${left}px`;

    const styles = {
        overlay: {
            background: 'rgba(255, 255, 255, 0.05)',
        },
        content: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            top: top || top === 0 ? topS : '50%',
            left: left || left === 0 ? leftS : '50%',
            minWidth: '280px',
            maxWidth: width ? `${width}px` : '340px',
            width: width ? `${width}px` : '340px',
            maxHeight: height ? `${height}px` : '250px',
            border: '3px solid rgba(255, 255,255, 0.6)',
            borderRadious: '3px',
            boxShadow: '-5px 7px 42px 0px rgba(0, 0, 0, 0.75)',
            ...customStyles,
        },
    };

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const modalBodyRef = useRef<ReactModal>(null);

    useEffect(() => {
        if (isOpen) {
            animateCSS(document.getElementById('modal-root'), 'fade-in');
        }
    }, [isOpen]);

    return (
        <div id="modal-root">
            {button ? (
                button
            ) : (
                <div>
                    <ExplorerBtn
                        icon={buttonIcon}
                        text={buttonText}
                        onClick={openModal}
                    />
                </div>
            )}
            <ReactModal
                ref={modalBodyRef}
                isOpen={isOpen ?? modalIsOpen}
                onAfterOpen={handleAfterModal}
                onRequestClose={handleClosing ?? closeModal}
                style={styles}
                contentLabel={modalLabel}
            >
                <ModalContainer className="modal-styles">
                    {modalTitle}
                    {children}
                </ModalContainer>
            </ReactModal>
        </div>
    );
}

function animateCSS(element: any, animationName: string, callback?: () => {}) {
    element.classList.add('animated', animationName);

    function handleAnimationEnd() {
        element.classList.remove('animated', animationName);
        element.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback();
    }

    element.addEventListener('animationend', handleAnimationEnd);
}

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
