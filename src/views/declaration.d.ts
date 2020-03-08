declare module '*.jpg';
declare module '*.ttf';

declare interface NodeModule {
    hot: {
        accept(path?: () => void, callback?: () => void): void;
    };
}

// declare module 'react-modal-resizable-draggable';

