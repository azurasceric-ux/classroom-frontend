import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { CreateResponse, HttpError } from "@refinedev/core";
import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";

if (!BACKEND_BASE_URL) {
    throw new Error("BACKEND_BASE_URL is not defined");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
    let message = "Request failed."

    try {
        const payload = (await response.json()) as { message?: string };
        if (payload?.message) {
            message = payload.message;
        }
    } catch (error) {
        //Ignore
    }

    return {
        message,
        statusCode: response.status,
    }
}

const options: CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({ resource }) => resource,

        buildQueryParams: async ({ resource, pagination, filters }) => {
            const page = pagination?.currentPage ?? 1;
            const pageSize = pagination?.pageSize ?? 10;

            const params: Record<string, string | number> = { page, limit: pageSize };

            filters?.forEach((filter) => {
                const field = 'field' in filter ? filter.field : '';
                const value = String(filter.value);

                if (resource === 'subjects') {
                    if (field === 'department') {
                        params.department = value;
                    }
                    if (field === 'name' || field === 'code') {
                        params.search = value;
                    }
                }
                else if (resource === 'classes') {
                    if (field === 'subject') {
                        params.subject = value;
                    }
                    if (field === 'teacher') {
                        params.teacher = value;
                    }
                    if (field === 'name') {
                        params.search = value;
                    }
                }
            })
            return params;
        },

        mapResponse: async (response) => {
            if (!response.ok) throw await buildHttpError(response);
            const payload: ListResponse = await response.json();
            return payload.data ?? [];
        },

        getTotalCount: async (response) => {
            if (!response.ok) throw await buildHttpError(response);
            const payload: ListResponse = await response.clone().json();
            return payload.pagination?.totalCount ?? 0;
        },
    },

    create: {
        getEndpoint: ({ resource }) => resource,

        buildBodyParams: async ({ variables }) => variables,

        mapResponse: async (response) => {
            if (!response.ok) throw await buildHttpError(response);
            const payload: CreateResponse = await response.json();
            if (!payload.data) {
                throw {
                    message: "Create response is missing `data`.",
                    statusCode: response.status,
                } as HttpError;
            }

            return payload.data;
        },
    },

    getOne: {
        getEndpoint: ({ resource, id }) => `${resource}/${id}`,

        mapResponse: async (response) => {
            if (!response.ok) throw await buildHttpError(response);
            const payload: CreateResponse = await response.json();
            if (!payload.data) {
                throw {
                    message: "Response is missing `data`.",
                    statusCode: response.status,
                } as HttpError;
            }

            return payload.data;
        },
    },

    update: {
        getRequestMethod: () => "put",
        getEndpoint: ({ resource, id }) => `${resource}/${id}`,

        buildBodyParams: async ({ variables }) => variables,

        mapResponse: async (response) => {
            if (!response.ok) throw await buildHttpError(response);
            const payload: CreateResponse = await response.json();
            if (!payload.data) {
                throw {
                    message: "Update response is missing `data`.",
                    statusCode: response.status,
                } as HttpError;
            }

            return payload.data;
        },
    },
    /*
        delete: {
            getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    
            mapResponse: async (response) => {
                if (!response.ok) throw await buildHttpError(response);
                const payload: CreateResponse = await response.json();
                if (!payload.data) {
                    throw {
                        message: "Delete response is missing `data`.",
                        statusCode: response.status,
                    } as HttpError;
                }
    
                return payload.data;
            },
        },
        */
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };