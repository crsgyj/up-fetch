/** The Standard Schema interface. */
interface StandardSchemaV1<Input = unknown, Output = Input> {
    /** The Standard Schema properties. */
    readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
declare namespace StandardSchemaV1 {
    /** The Standard Schema properties interface. */
    export interface Props<Input = unknown, Output = Input> {
        /** The version number of the standard. */
        readonly version: 1;
        /** The vendor name of the schema library. */
        readonly vendor: string;
        /** Validates unknown input values. */
        readonly validate: (value: unknown) => Result<Output> | Promise<Result<Output>>;
        /** Inferred types associated with the schema. */
        readonly types?: Types<Input, Output> | undefined;
    }
    /** The result interface of the validate function. */
    export type Result<Output> = SuccessResult<Output> | FailureResult;
    /** The result interface if validation succeeds. */
    export interface SuccessResult<Output> {
        /** The typed output value. */
        readonly value: Output;
        /** The non-existent issues. */
        readonly issues?: undefined;
    }
    /** The result interface if validation fails. */
    export interface FailureResult {
        /** The issues of failed validation. */
        readonly issues: ReadonlyArray<Issue>;
    }
    /** The issue interface of the failure output. */
    export interface Issue {
        /** The error message of the issue. */
        readonly message: string;
        /** The path of the issue, if any. */
        readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
    }
    /** The path segment interface of the issue. */
    export interface PathSegment {
        /** The key representing a path segment. */
        readonly key: PropertyKey;
    }
    /** The Standard Schema types interface. */
    export interface Types<Input = unknown, Output = Input> {
        /** The input type of the schema. */
        readonly input: Input;
        /** The output type of the schema. */
        readonly output: Output;
    }
    /** Infers the input type of a Standard Schema. */
    export type InferInput<Schema extends StandardSchemaV1> = NonNullable<Schema["~standard"]["types"]>["input"];
    /** Infers the output type of a Standard Schema. */
    export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<Schema["~standard"]["types"]>["output"];
    export {  };
}

type KeyOf<O> = O extends unknown ? keyof O : never;
type DistributiveOmit<TObject extends object, TKey extends KeyOf<TObject> | (string & {})> = TObject extends unknown ? Omit<TObject, TKey> : never;
type MaybePromise<T> = T | Promise<T>;
type JsonPrimitive = string | number | boolean | null | undefined;
type JsonifiableObject = Record<PropertyKey, any>;
type JsonifiableArray = Array<JsonPrimitive | JsonifiableObject | Array<any> | ReadonlyArray<any>> | ReadonlyArray<JsonPrimitive | JsonifiableObject | JsonifiableArray>;
type BaseFetchFn = (input: any, options?: any, ctx?: any) => Promise<Response>;
type ParseResponse<TParsedData> = (response: Response, request: Request) => MaybePromise<TParsedData>;
type ParseRejected = (response: Response, request: Request) => any;
type SerializeBody<TRawBody> = (body: TRawBody) => BodyInit | null | undefined;
type SerializeParams = (params: Params) => string;
type Params = Record<string, any>;
type RawHeaders = HeadersInit | Record<string, string | number | null | undefined>;
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'HEAD' | (string & {});
type BaseOptions<TFetch extends BaseFetchFn> = DistributiveOmit<NonNullable<Parameters<TFetch>[1]>, 'body' | 'headers' | 'method'> & {};
/**
 * while `unknown` does not work with type guards, `{}` does
 * `{}` behaves like `unknown` when trying to access properties (ts gives an error)
 */
type Unknown = {};
type RetryContext = {
    response: Response;
    error: undefined;
    request: Request;
} | {
    response: undefined;
    error: Unknown;
    request: Request;
};
type RetryWhen = (context: RetryContext) => MaybePromise<boolean>;
type RetryAttempts = number | ((context: {
    request: Request;
}) => MaybePromise<number>);
type RetryDelay = number | ((context: RetryContext & {
    attempt: number;
}) => MaybePromise<number>);
type RetryOptions = {
    /**
     * The number of attempts to make before giving up
     */
    attempts?: RetryAttempts;
    /**
     * The delay before retrying
     */
    delay?: RetryDelay;
    /**
     * Function to determine if a retry attempt should be made
     */
    when?: RetryWhen;
};
type OnRetry = (context: RetryContext & {
    attempt: number;
}) => MaybePromise<void>;
type StreamingEvent = {
    /** The last streamed chunk */
    chunk: Uint8Array;
    /** Total bytes, read from the response header "Content-Length" */
    totalBytes: number;
    /** Transferred bytes  */
    transferredBytes: number;
};
type DefaultRawBody = BodyInit | JsonifiableObject | JsonifiableArray;
/**
 * Default configuration options for the fetch client
 */
type DefaultOptions<TFetchFn extends BaseFetchFn, TDefaultParsedData, TDefaultRawBody> = BaseOptions<TFetchFn> & {
    /** Base URL to prepend to all request URLs */
    baseUrl?: string;
    /** Request headers to be sent with each request */
    headers?: RawHeaders;
    /** HTTP method to use for the request */
    method?: Method;
    /** Callback executed when the request fails */
    onError?: (error: Unknown, request?: Request) => Error | void;
    /** Callback executed before the request is made */
    onRequest?: (request: Request) => void;
    /** Callback executed each time a chunk of the request stream is sent */
    onRequestStreaming?: (event: StreamingEvent, request: Request) => void;
    /** Callback executed each time a chunk of the response stream is received */
    onResponseStreaming?: (event: StreamingEvent, response: Response) => void;
    /** Callback executed before each retry */
    onRetry?: OnRetry;
    /** Callback executed when the request succeeds */
    onSuccess?: (data: any, request: Request) => void;
    /** URL parameters to be serialized and appended to the URL */
    params?: Params;
    /** Function to parse response errors */
    parseRejected?: ParseRejected;
    /** Function to parse the response data */
    parseResponse?: ParseResponse<TDefaultParsedData>;
    /** parseError */
    parseError?: (error: any, request?: Request) => Error | void;
    /** Function to determine if a response should throw an error */
    reject?: (response: Response) => MaybePromise<boolean>;
    /** The default retry options. Will be merged with the fetcher options */
    retry?: RetryOptions;
    /** Function to serialize request body. Restrict the valid `body` type by typing its first argument. */
    serializeBody?: SerializeBody<TDefaultRawBody>;
    /** Function to serialize URL parameters */
    serializeParams?: SerializeParams;
    /** AbortSignal to cancel the request */
    signal?: AbortSignal;
    /** Request timeout in milliseconds */
    timeout?: number;
};
/**
 * Options for individual fetch requests
 */
type FetcherOptions<TFetchFn extends BaseFetchFn, TSchema extends StandardSchemaV1, TParsedData, TRawBody> = BaseOptions<TFetchFn> & {
    /** Base URL to prepend to the request URL */
    baseUrl?: string;
    /** Request body data */
    body?: NoInfer<TRawBody> | null | undefined;
    /** Request headers */
    headers?: RawHeaders;
    /** HTTP method */
    method?: Method;
    /** Callback executed when the request fails */
    onError?: (error: Unknown, request?: Request) => Error | void;
    /** Callback executed before the request is made */
    onRequest?: (request: Request) => void;
    /** Callback executed each time a chunk of the request stream is sent */
    onRequestStreaming?: (event: StreamingEvent, request: Request) => void;
    /** Callback executed each time a chunk of the response stream is received */
    onResponseStreaming?: (event: StreamingEvent, response: Response) => void;
    /** Callback executed before each retry */
    onRetry?: OnRetry;
    /** Callback executed when the request succeeds */
    onSuccess?: (data: any, request: Request) => void;
    /** URL parameters */
    params?: Params;
    /** parseError */
    parseError?: (error: any, request?: Request) => Error | void;
    /** Function to parse response errors */
    parseRejected?: ParseRejected;
    /** Function to parse the response data */
    parseResponse?: ParseResponse<TParsedData>;
    /** Function to determine if a response should throw an error */
    reject?: (response: Response) => MaybePromise<boolean>;
    /** The fetch retry options. Merged with the default retry options */
    retry?: RetryOptions;
    /** JSON Schema for request/response validation */
    schema?: TSchema;
    /** Function to serialize request body. Restrict the valid `body` type by typing its first argument. */
    serializeBody?: SerializeBody<TRawBody>;
    /** Function to serialize URL parameters */
    serializeParams?: SerializeParams;
    /** AbortSignal to cancel the request */
    signal?: AbortSignal;
    /** Request timeout in milliseconds */
    timeout?: number;
};
type UpFetch<TDefaultParsedData, TDefaultRawBody, TFetchFn extends BaseFetchFn> = <TParsedData = TDefaultParsedData, TSchema extends StandardSchemaV1<TParsedData, any> = StandardSchemaV1<TParsedData>, TRawBody = TDefaultRawBody>(input: Parameters<TFetchFn>[0], fetcherOpts?: FetcherOptions<TFetchFn, TSchema, TParsedData, TRawBody>, ctx?: Parameters<TFetchFn>[2]) => Promise<StandardSchemaV1.InferOutput<TSchema>>;

declare const up: <TFetchFn extends BaseFetchFn, TDefaultParsedData = any, TDefaultRawBody = DefaultRawBody>(fetchFn: TFetchFn, getDefaultOptions?: (input: Exclude<Parameters<TFetchFn>[0], Request>, fetcherOpts: FetcherOptions<TFetchFn, any, any, any>, ctx?: Parameters<TFetchFn>[2]) => MaybePromise<DefaultOptions<TFetchFn, TDefaultParsedData, TDefaultRawBody>>) => UpFetch<TDefaultParsedData, TDefaultRawBody, TFetchFn>;

declare class ResponseError<TData = any> extends Error {
    name: 'ResponseError';
    response: Response;
    request: Request;
    data: TData;
    status: number;
    constructor(res: Response, data: TData, request: Request);
}
declare const isResponseError: <TData = any>(error: unknown) => error is ResponseError<TData>;

declare class ValidationError<TData = any> extends Error {
    name: 'ValidationError';
    issues: readonly StandardSchemaV1.Issue[];
    data: TData;
    constructor(result: StandardSchemaV1.FailureResult, data: TData);
}
declare const isValidationError: (error: unknown) => error is ValidationError;

declare const isJsonifiable: (value: any) => value is JsonifiableObject | JsonifiableArray;

export { type DefaultOptions, type FetcherOptions, ResponseError, type RetryOptions, StandardSchemaV1, ValidationError, isJsonifiable, isResponseError, isValidationError, up };
