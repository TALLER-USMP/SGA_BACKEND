import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export interface Listable {
  list(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
}

export interface Readable {
  getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
}

export interface Creatable {
  create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
}

export interface Updatable {
  update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
}

export interface Deletable {
  delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
}

export type ReadOnlyController = Listable & Readable;
export type WriteOnlyControlelr = Readable & Creatable & Updatable & Deletable;
export type CrudController = ReadOnlyController & WriteOnlyControlelr;
