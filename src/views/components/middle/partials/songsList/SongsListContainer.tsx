import React from 'react';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';
import img from '../../../../assets/img/Record-Album-02.jpg';
// import { Hr } from '../../../shared';
// import { EQBars } from './EQBars';
import { Songs } from './Songs';
import { ISong } from '@services/db';
import { FaSpinner } from 'react-icons/fa';

type Props = {
    loading: boolean;
    current?: TreeListType;
    pointer: number;
    getPlayer: () => HTMLMediaElement | null;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload: any
    ) => void;
    status: string;
};

export function SongsListContainer({
    current,
    pointer,
    handleAction,
    status,
    loading,
}: Props) {
    // const [width, setWidth] = useState(window.innerWidth);

    // const updateWidth = () => {
    //     setWidth(window.innerWidth);
    // };

    // useEffect(() => {
    //     window.addEventListener('resize', updateWidth);
    //     return () => window.removeEventListener('resize', updateWidth);
    // });

    return (
        <div className="main-body playlist-container">
            <div
                style={{
                    margin: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        height: '14vh',
                        width: '14vh',
                        // padding: '1rem',
                        border: '2px dashed rgba(200, 200, 200, 0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        style={{
                            display: 'flex',
                            height: '14vh',
                            width: '14vh',
                            // padding: '1rem',
                            padding: 0,
                            margin: 0,
                            alignItems: 'censter',
                            justifyContent: 'center',
                        }}
                        src={img}
                        alt=""
                    />
                </div>
                <h3 className="title-text">
                    {current?.title},{' '}
                    <small className="tiny-text">
                        {current?.nested?.length || 0} songs
                    </small>
                </h3>
            </div>
            <Songs
                loading={loading}
                playlistId={current?.id}
                status={status}
                songs={current?.nested as ISong[]}
                pointer={pointer}
                handleAction={handleAction}
            />
            {loading && <FaSpinner className="spinner spin" size="200px" />}
        </div>
    );
}

// <Hr width="95%" />;
// {current && <EQBars cols={Math.round((width - 300) / 41)} />}
