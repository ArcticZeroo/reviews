import Duration, { DurationOrMilliseconds } from '@arcticzeroo/duration';
import { useState } from 'react';
import { Timer } from '../models/timer';

/**
 * Every time this function is called, we want to perform some action [timeDelay] after, but if it's called again,
 * we want to delay the action again to be [timeDelay] from the latest call. One use case for this is keyboard input,
 * where the user may be typing very quickly and we don't want to issue a search result on every key, only once they
 * have stopped for 200ms or so.
 * @param timeDelay - A time to wait between calling the callback
 */
export const useDebounceAfterDelay = <T>(timeDelay: DurationOrMilliseconds) => {
    const timeDelayDuration = Duration.fromDurationOrMilliseconds(timeDelay);

    const [currentTimeout, setCurrentTimeout] = useState<Timer | null>();
    const [currentValue, setCurrentValue] = useState<T>();

    const setDebouncedValue = (value: T) => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        setCurrentTimeout(setTimeout(() => {
            setCurrentValue(value);
        }, timeDelayDuration.inMilliseconds));
    };

    return [currentValue, setDebouncedValue] as const;
};
