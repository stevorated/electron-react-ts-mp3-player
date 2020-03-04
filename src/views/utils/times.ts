import dayjs from 'dayjs';

export const formatMillsToTime = (value: number) => {
    return dayjs(value).format('mm:ss');
};
