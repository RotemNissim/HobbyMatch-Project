import { NextFunction, Response, Request } from 'express';
import { AuthRequest } from './AuthRequest';
const asyncHandler = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
        fn(req as AuthRequest, res, next).catch(next);
    };

    export default asyncHandler;


