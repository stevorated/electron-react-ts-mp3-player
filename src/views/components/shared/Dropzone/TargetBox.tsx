import React from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { FaPlusCircle } from 'react-icons/fa';

export interface TargetBoxProps {
    height?: string;
    width?: string;
    onDrop: (props: TargetBoxProps, monitor: DropTargetMonitor) => void;
}

function TargetBox(props: TargetBoxProps) {
    const { onDrop } = props;
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: [NativeTypes.FILE],
        drop(_, monitor) {
            if (onDrop) {
                onDrop(props, monitor);
            }
        },

        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const style: React.CSSProperties = {
        padding: '2rem',
        textAlign: 'center',
        height: props.height ?? '20vh',
        width: props.width ?? '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const isActive = canDrop && isOver;
    return (
        <div ref={drop} style={style}>
            {isActive ? 'Release to drop' : <FaPlusCircle size="30px" />}
        </div>
    );
}

export default TargetBox;
