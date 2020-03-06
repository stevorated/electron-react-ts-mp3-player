import React, { ReactNode, useState } from 'react';
import ReactModal from 'react-modal';
import { ExplorerBtn } from '../explorer/partials/ExplorerBtn';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

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
}: Props) {
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div
            className="hoverable"
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {button ? (
                button
            ) : (
                <ExplorerBtn
                    icon={buttonIcon}
                    text={buttonText}
                    onClick={openModal}
                />
            )}
            <ReactModal
                isOpen={isOpen ?? modalIsOpen}
                onAfterOpen={handleAfterModal}
                onRequestClose={handleClosing ?? closeModal}
                style={customStyles}
                contentLabel={modalLabel}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {modalTitle}
                    {children}
                </div>
            </ReactModal>
        </div>
    );
}
