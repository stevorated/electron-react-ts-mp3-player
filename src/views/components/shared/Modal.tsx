import React, { ReactNode, useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import styled, { CSSObject } from 'styled-components';
import { ExplorerBtn } from '../explorer/partials/ExplorerBtn';

import './modal.style.less';

type Props = {
    modalLabel: string;
    buttonText: string;
    modalTitle?: string;
    isOpen?: boolean;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    buttonIcon?: ReactNode;
    button?: ReactNode;
    children?: ReactNode;
    customStyles?: CSSObject;
    handleClosing?: () => void;
    handleAfterModal?: () => void;
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
            background: 'rgba(0, 0, 0, .6)',
        },
        content: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            top: top || top === 0 ? topS : '50%',
            left: left || left === 0 ? leftS : '50%',
            height: height ? `${height}px` : '230px',
            width: width ? `${width}px` : '340px',
            // maxHeight: height ? `${height}px` : '250px',
            border: '3px solid rgba(255, 255,255, 0.6)',
            borderRadious: '1px',
            boxShadow: '-5px 7px 42px 0px rgba(0, 0, 0, 0.75)',
            bottom: undefined,
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
    // const modalRootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {}, []);

    return (
        <div id="modal-root">
            {button ? (
                button
            ) : (
                <div>
                    <ExplorerBtn icon={buttonIcon} text={buttonText} onClick={openModal} />
                </div>
            )}
            <ReactModal
                closeTimeoutMS={500}
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

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
