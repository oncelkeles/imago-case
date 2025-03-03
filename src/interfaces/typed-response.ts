import {Response as ExpressResponse} from "express";

export interface TypedResponse<ResBody> extends ExpressResponse {
  json: (body: ResBody) => this;
}
