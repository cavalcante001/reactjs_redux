import * as types from './actionTypes';
import axios from 'axios';
import {resources, appConfig} from 'mre-config-react/consts';

const urlEdocs = `${resources.woody}e-memo/protocolo`;
const urlCorporativo = `${resources.woody}v2/corporativo/pessoa-unidade-grupo`;

export function recuperarDocumentoNup(nuProtocolo) {
    
    return function(dispatch) {
        return axios.get(urlEdocs, {params: {nuProtocolo: nuProtocolo}}).then((response) => {
            dispatch(documentoSuccess(response.data));
        });
    };
}

export function documentoSuccess(objDocumento) {
    return {
        type: types.FETCH_DOCUMENTO_NUP,
        documento: objDocumento,
    };
}

export function recuperarMencionado(strMencionado) {
    return function(dispatch) {
        return axios.get(urlCorporativo, {params: {idUnidadeOrigem: 0, idSistema: appConfig.idSistema, descricao: strMencionado}}).then((response) => {
            if (response.data._embedded.pessoa_unidade_grupo.length > 0) {
                return response.data._embedded.pessoa_unidade_grupo[0]
            }
        });
    };
}