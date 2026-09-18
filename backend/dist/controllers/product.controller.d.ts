type IdParam = {
    id: string;
};
export declare const getAllProducts: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const createTheProduct: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const updateTheProduct: import("express").RequestHandler<IdParam, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const deleteTheProduct: import("express").RequestHandler<IdParam, any, any, import("qs").ParsedQs, Record<string, any>>;
export {};
//# sourceMappingURL=product.controller.d.ts.map