# MRE-REFERENCIA-REACT

Componente para identificar NUP e Mencionados no texto e criar link para o sistema especifico.


### Instalação
```
yarn add git+ssh://git@bitbucket.itamaraty.gov.br:7999/afrodite/mre-referencia-react.git
```

### Utilização:
```
Configuração do app-config-mre-env.js contendo o idSistema
Exemplo:
local: {
    idSistema: 1314
},
development: {
    idSistema: 1314
},
homolog: {
    idSistema: 36
},
production: {
    idSistema: 36
},

=========================================================================================
import Referencia from 'mre-referencia-react';
...
render(){
    <div>
        <Referencia texto={this.props.texto} className={'preview-span text-format'}/>
    </div>
}
```

### Referencia

#### Prop Types
| Nome          | Tipo          | Descrição     |
| ------------- | ------------- | ------------- |
| texto         | string        | Conteúdo da descrição |
| className     | string        | Classes a serem usadas no componente tag `<p>`
