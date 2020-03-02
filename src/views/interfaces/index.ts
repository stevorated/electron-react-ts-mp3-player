import PageInterface from './PageInterface';
import { IpcMainEvent } from 'electron';

export { PageInterface };

export interface IpcChannelInterface {
    getName(): string;

    handle(event: IpcMainEvent, request: IpcRequest): void;
}

export interface IpcRequest {
    responseChannel?: string;

    params?: string[];
}
