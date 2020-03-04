import React, {
    Component,
    FunctionComponent,
    useState,
    useEffect,
} from 'react';
import { EQBars } from './EQBars';
import { Songs } from './Songs';
import { playlistsMock } from '../../../../constants/mocks';

type Props = {};

export const SongsListContainer: FunctionComponent<Props> = () => {
    const [width, setWidth] = useState(window.innerWidth);

    const updateWidth = () => {
        console.log(Math.round((window.innerWidth - 300) / 31));
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    });
    const { songs } = playlistsMock[0];
    return (
        <div className="main-body playlist-container">
            <EQBars cols={Math.round((width - 300) / 41)} />
            <Songs rows={17} songs={songs} />
        </div>
    );
};
