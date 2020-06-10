import { Params, ParamsDictionary, Query, RequestHandler } from 'express-serve-static-core';

interface ResBody {
    ok: boolean;
    payload?: object;
}

type PostBody<T> = {
    nonce: string;
    signature: string;
    payload: object;
} & T;

export type GetHandler<P extends Params = ParamsDictionary, ReqBody = {}, ReqQuery = Query> = RequestHandler<P, ResBody, ReqBody, ReqQuery>;
export type PostHandler<P extends Params = ParamsDictionary, ReqBody = {}, ReqQuery = Query> = RequestHandler<P, ResBody, PostBody<ReqBody>, ReqQuery>;
