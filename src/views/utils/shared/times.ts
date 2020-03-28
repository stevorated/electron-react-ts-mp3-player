import dayjs from 'dayjs';

export const formatMillsToTime = (value?: number) => {
    if (!value) {
        return '00:00';
    }
    return dayjs(value).format('mm:ss');
};
