import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';

import { ISong } from '@services/db';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

import ItemTypes from './ItemTypes';
import { Song } from './Song';

const style = {
    cursor: 'move',
};

export interface Props {
    id: any;
    song: ISong;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    handleSortSongs: (
        songId: number,
        newIndex: number,
        oldIndex: number
    ) => void;
    pointer: number;
    status: string;
    playlistId: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}
export function SongContainer({
    id,
    song,
    index,
    moveCard,
    status,
    playlistId,
    pointer,
    handleAction,
    handleSortSongs,
}: Props) {
    const { song_index: songIndex } = song;
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const oldPos = item.index;
            const newPos = index;

            if (oldPos === newPos) {
                return;
            }

            const hoverBoundingRect = ref.current!.getBoundingClientRect();

            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            const clientOffset = monitor.getClientOffset();

            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (oldPos < newPos && hoverClientY < hoverMiddleY) {
                return;
            }

            if (oldPos > newPos && hoverClientY > hoverMiddleY) {
                return;
            }

            moveCard(oldPos, newPos);
            item.index = newPos;
        },
        drop(item: DragItem, _: DropTargetMonitor) {
            handleSortSongs(
                parseInt(item.id),
                item.index + 1,
                song?.song_index || -1
            );
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, index },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;

    drag(drop(ref));

    return (
        <div ref={ref} style={{ ...style, opacity }}>
            <Song
                index={index + 1}
                song={song}
                active={songIndex === pointer + 1}
                status={status}
                handleAction={handleAction}
                playlistId={playlistId}
            />
        </div>
    );
}
