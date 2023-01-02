import { CustomError } from '../utils/CustomError';

export default function errorHandler(err: any, req: any, res: any, next: any) {
    if (err.name === 'CustomError') {
        const { statusCode, errors } = err;
        res.status(statusCode).json({
            errors,
        });
    } else {
        res.status(500).json({ error: err.message });
    }
}
