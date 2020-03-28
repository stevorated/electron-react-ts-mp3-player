import { StateActions } from '@views/interfaces/state.interfaces';
import { IState } from '@services/db';

export const FETCH_STATE = 'FETCH_STATE';
export function fetchState(partialState: IState): StateActions {
    return {
        type: FETCH_STATE,
        payload: partialState,
    };
}

export const UPDATE_STATE = 'UPDATE_STATE';
export function updateState(partialState: Partial<IState>): StateActions {
    return {
        type: UPDATE_STATE,
        payload: partialState,
    };
}
