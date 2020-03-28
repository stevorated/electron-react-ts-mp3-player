import { StateActions } from '@views/interfaces';

import { FETCH_STATE } from '../actions';
import { IState } from '@services/db';
import { UPDATE_STATE } from './../actions/state.actions';

const initialState = {} as IState;

export const stateReducer = (
    state: IState = initialState,
    { type, payload }: StateActions
) => {
    switch (type) {
        case FETCH_STATE:
            return payload;

        case UPDATE_STATE:
            return { ...state, ...payload };
        default:
            return state;
    }
};
