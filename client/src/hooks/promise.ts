import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * React has no mechanism yet (until suspense) to synchronously retrieve promise state in an application,
 * so boilerplate code often gets copy/pasted. This method aims to reduce the boilerplate.
 * @param returnsPromise - A function which returns the promise for which you want to get the state of. You MUST
 *  wrap this callback in a useCallback unless you know it is already wrapped. If you do not wrap this callback,
 *  you are most likely going to see an infinite loop of calls.
 * @param name - An optional name for this promise, to use in logging failures
 */
export const usePromiseState = <T>(returnsPromise: () => Promise<T>, name?: string): readonly [T | undefined, any, () => void] => {
    const [value, setValue] = useState<T | undefined>();
    const [error, setError] = useState<any>();

    const run = useCallback(() => {
        setValue(undefined);
        setError(undefined);

        returnsPromise()
            .then(result => {
                setValue(result);
                return result;
            })
            .catch(err => {
                console.error(`${name ?? 'Promise'} failed:`, err);
                setError(err);
                return err;
            });
    }, [returnsPromise]);

    useEffect(() => {
        run();
    }, [run]);

    return [value, error, run] as const;
};

export const useStaticPromiseState = <T>(promise: Promise<T>): readonly [T | undefined, any] => {
    const [value, setValue] = useState<T | undefined>();
    const [error, setError] = useState<any>();

    useEffect(() => {
        promise
            .then(setValue)
            .catch(setError);
    }, [promise]);

    return [value, error] as const;
};

export const useLatestPromiseState = <T>(returnsPromise: () => Promise<T>, keepLastValue: boolean = true) => {
    const [value, setValue] = useState<T | undefined>();
    const [error, setError] = useState<any>();
    const currentSymbol = useRef<symbol | null>(null);

    const run = useCallback(() => {
        if (!keepLastValue) {
            setValue(undefined);
        }
        setError(undefined);

        const thisRunSymbol = Symbol();
        currentSymbol.current = thisRunSymbol;

        returnsPromise()
            .then(result => {
                if (currentSymbol.current === thisRunSymbol) {
                    setValue(result);
                }
                return result;
            })
            .catch(err => {
                console.error('Promise failed:', err);
                if (currentSymbol.current === thisRunSymbol) {
                    setValue(undefined);
                    setError(err);
                }
                return err;
            });
    }, [returnsPromise, keepLastValue]);

    return [value, error, run] as const;
};