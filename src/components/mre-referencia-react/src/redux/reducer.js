import * as types from './actionTypes';

const initialState = {
    documentoByNup: {
    }
};

export default function(state = initialState, action) {

    switch (action.type) {
        case types.FETCH_DOCUMENTO_NUP:
            return {
                ...state,
                documentoByNup: {
                    ...state.documentoByNup,
                    [action.documento.nu_protocolo]: action.documento
                }
            };

        default:
            return state;
    }
}
