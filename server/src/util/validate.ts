export interface IRangeValidationOptions {
    value: unknown;
    min: number;
    max: number;
    name: string;
}

export const validateRangeInclusive = ({ value, min, max, name }: IRangeValidationOptions) => {
    if (typeof value !== 'number') {
        throw new RangeError(`${name} must be a number.`);
    }

    if (value < min || value > max) {
        throw new RangeError(`${name} between ${min} and ${max}.`)
    }
};
