import { FETCH_STATE, UPDATE_STATE } from '@views/store';
import { IState } from '@services/db';

export type FetchState = {
    type: typeof FETCH_STATE;
    payload: IState;
};

export type UpdateState = {
    type: typeof UPDATE_STATE;
    payload: Partial<IState>;
};

export type StateActions = FetchState | UpdateState;
