export const getTimezoneOffsetDate = (date: Date) => {
    const newDate = new Date(date.getTime());
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
};