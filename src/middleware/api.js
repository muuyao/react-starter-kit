import { normalize, Schema, arrayOf } from 'normalizr';
import { DEFAULT_REQUEST, DEFAULT_SUCCESS, DEFAULT_FAILTURE} from '../actions/global';

export default ({
    dispatch,
    getState
}) => {
    return function(next) {
        return function(action) {
            const {
                shouldDefaultTypes = [true, true, true],
                loading = false,
                types,
                callAPI,
                shouldCallAPI = () => true,
                payload = {},
                schema
            } = action;

            if (!types) {
                // 普通 action：传递
                return next(action);
            }

            if (!Array.isArray(types) ||
                types.length !== 3 ||
                !types.every(type => typeof type === 'string')
            ) {
                throw new Error('Expected an array of three string types.');
            }

            if (typeof callAPI !== 'function') {
                throw new Error('Expected fetch to be a function.');
            }

            if (!shouldCallAPI(getState())) {
                return;
            }

            const [requestType, successType, failureType] = types;
            const [shouldDefaultRequestType, shouldDefalutSuccessType, shouldDefalutFailtureType] = shouldDefaultTypes;

            if (requestType) {
                dispatch({
                    ...payload,
                    type: requestType
                });
            }

            let request = callAPI();
            if (shouldDefaultRequestType) {
                dispatch({
                    type: DEFAULT_REQUEST,
                    loading: loading,
                    request: request
                });
            }

            return request
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        return response
                    } else {
                        var error = new Error(response.statusText)
                        error.response = response;
                        error.msg = response.statusText;
                        throw error
                    }

                })
                .then(response => {
                    return response.json()
                })
                .then(json => {

                    if (json.state && json.state.code === 0) {

                        if (shouldDefaultRequestType && shouldDefalutSuccessType) {
                            dispatch({
                                type: DEFAULT_SUCCESS,
                                loading: loading,
                                request: request
                            });
                        }

                        let responseData = json;
                        let responseSchema = null;

                        if(schema){
                            if(responseData.data && responseData.data.dataList){
                                responseSchema = normalize(responseData.data.dataList, schema);
                            } else if(json.data){
                                responseSchema = normalize(responseData.data, schema);
                            }

                        }

                        dispatch({
                            ...payload,
                            ... {
                                data: responseData,
                                schema: responseSchema,
                                type: successType
                            }
                        });
                    } else {
                        var msg = (json.state && json.state.msg) || '请求失败，请稍后重试';
                        var error = new Error(msg)
                        error.response = json;
                        error.msg = msg;
                        throw error
                    }
                })
                .catch(error => {
                    if (shouldDefalutFailtureType) {
                        dispatch({
                            type: DEFAULT_FAILTURE,
                            loading: loading,
                            request: request,
                            error: error
                        });
                    }

                    if (failureType) {
                        dispatch({
                            ...payload,
                            ... {
                                error: error,
                                type: failureType
                            }
                        });
                    }
                })
        };
    };
}
