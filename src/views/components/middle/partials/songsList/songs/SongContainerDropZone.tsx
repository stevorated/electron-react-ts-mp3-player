import React from 'react';

import { Dropzone } from '../../../../shared';

type Props = {
    height?: string;
    handleDrop?: (files: File[]) => void;
};

export function SongContainerDropZone({ height, handleDrop }: Props) {
    return <Dropzone height={height} handleDrop={handleDrop} />;
}
