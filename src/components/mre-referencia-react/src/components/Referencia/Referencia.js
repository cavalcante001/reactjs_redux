import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resources} from 'mre-config-react/consts';
import * as documentoActions from '../../redux/actions';
import * as documentoSelectors from "../../redux/selectors";
import {
    CircularProgress
} from 'react-md';

class Referencia extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            arrTexto: [],
            isLoading: true
        };

        this.recuperarMarcadoresTexto = this.recuperarMarcadoresTexto.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        if (typeof(this.props.texto) !== 'undefined') {
            if (this.props.texto) {
                this.recuperarMarcadoresTexto(this.props.texto).then((resolve) => {
                    if (this._isMounted) this.setState({arrTexto: resolve, isLoading: false});
                })
            } else {
                this.setState({arrTexto: [], isLoading: false});
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    recuperarMarcadoresTexto(strTexto) {

        let regexGlobal = /(\[\~.*?])|([0-9]{7}\.[0-9]{8}\/[0-9]{4}\-[0-9]{2}|[0-9]{21})/g
        let regexNup = /([0-9]{7}\.[0-9]{8}\/[0-9]{4}\-[0-9]{2}|[0-9]{21})/g;
        let regexMencao = /(\[\~.*?])/g;

        let arrTexto = strTexto.split(regexGlobal).map((texto) => {
            if(texto) {
                if (texto.match(regexMencao)) {
                    return this.recuperarMencionado(texto.split(/\[\~(.*?)\]/mgi).filter(Boolean)[0]).then((resolve) => {
                        return resolve;
                    });
                }
                if (texto.match(regexNup)) {
                    return this.recuperarDocumentoNup(texto).then((resolve) => {
                        return resolve;
                    });
                }
                return texto;
            }
        })

        return Promise.all(arrTexto.filter(Boolean));
    }

    recuperarMencionado(strMencionado) {
        let objMencionado = this.props.documentoActions.recuperarMencionado(strMencionado).then((response) => {
            console.log(strMencionado);
                console.log(response);
                if (!response) {
                    return strMencionado;
                }
                return this.montarLinkMencionado(response);
            });
        return Promise.resolve(objMencionado);
    }

    recuperarDocumentoNup(strNup) {

        let objDocumentoNup = this.props.documento[strNup];

        if(!objDocumentoNup){
            let objDocumentoPromise = this.props.documentoActions.recuperarDocumentoNup(strNup).then(() => {
                return this.montarLinkDocumento(this.props.documento[strNup]);
            });
            return Promise.resolve(objDocumentoPromise);
        } else {
            return Promise.resolve(this.montarLinkDocumento(objDocumentoNup));
        }
    }

    slugify(str) {
        if (!str) {
            return;
        }

        str = str.toLowerCase();
        str = str.replace(/^\s+|\s+$/g, ''); // trim

        // remove accents, swap ñ for n, etc
        var from = 'àáäâãèéëêìíïîòóöôõùúüûñç·/_,:;ºª';
        var to = 'aaaaaeeeeiiiiooooouuuunc------oa';
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes

        return str;
    };

    montarLinkMencionado(objMencionado) {
        if (objMencionado) {
            switch(objMencionado.tipo) {
                case 1:
                    return <a href={`${resources.intratec}local/${objMencionado.id}-${this.slugify(objMencionado.descricao)}`} target="_blank">{objMencionado.sigla_unidade}</a>;
                case 2:
                    return <a href={`${resources.intratec}local/${objMencionado.id}-${this.slugify(objMencionado.descricao)}`} target="_blank">{objMencionado.sigla_unidade}</a>;
                case 3:
                    return <a href={`${resources.intratec}perfil/${objMencionado.no_usuario}`} target="_blank">{objMencionado.no_usuario}</a>;
                case 4:
                    return <a href={`${resources.intratec}local/${objMencionado.id}-${this.slugify(objMencionado.descricao)}`} target="_blank">{objMencionado.sigla_unidade}</a>;
                default:
                    return <a href={`${resources.intratec}`} target="_blank">{objMencionado.no_usuario ? objMencionado.no_usuario : objMencionado.sigla_unidade}</a>;
            }
        }
    }

    /**
     * "1";"Minimemo" documento/
     * "2";"Memorando" documento-memorando/
     * "3";"Ofício" documento-oficio/
     * "4";"e-Folha" documento-evento-folha/
     * @param  object objDocumento
     * @return string
     */
    montarLinkDocumento(objDocumento) {
        console.log('entrou aqui');
        switch(objDocumento._embedded.id_tipo_documento.id_tipo_documento) {
            case 1:
                return <a href={`${resources.edocs}documento/${objDocumento.id_documento}`} target="_blank">{objDocumento.nu_protocolo}</a>;
            case 2:
                let idMemorando = objDocumento._embedded.memorando[0]._links.self.href.match(/([0-9]{1,})/g)[0];
                return <a href={`${resources.edocs}documento-memorando/${idMemorando}`} target="_blank">{objDocumento.nu_protocolo}</a>;
            case 3:
                return <a href={`${resources.edocs}documento-oficio/${objDocumento.id_documento}`} target="_blank">{objDocumento.nu_protocolo}</a>;
            case 4:
                return <a href={`${resources.edocs}documento-evento-folha/${objDocumento.id_documento}`} target="_blank">{objDocumento.nu_protocolo}</a>;
            default:
                return <a href={`${resources.edocs}`} target="_blank">{objDocumento.nu_protocolo}</a>;
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <CircularProgress id="referencia-documento-loading-progress" scale={1} centered={false} className={'primary-color'}/>
            )
        }

        if (!this.state.isLoading) {
            return(
                <div>
                    <p className={this.props.className}>
                        {
                            (this.state.arrTexto.length > 0 && !this.state.isLoading) &&
                            this.state.arrTexto.map((texto, key) => {
                                return (
                                    <span key={key}>
                                    {texto}
                                    </span>
                                )
                            })
                        }
                    </p>
                </div>
            )
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        documento: documentoSelectors.getDocumentoNup(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        documentoActions: bindActionCreators(documentoActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Referencia);
