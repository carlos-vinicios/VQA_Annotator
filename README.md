
# VQA_Annotator

Uma proposta de ferramenta de anotação de documentos para a tarefa de Visual Question and Answer. Encontra-se em fase de desenvolvimento do MVP.

## Execução local

Primeiro é necessário criar duas pastas (pdfs e annotations) na raiz do projeto. O diretório pdfs fica responsável por prover os documentos que serão exibidos no anotador. O diretório annotations fica responsável por armazenar as anotações realizadas. Caso tenha algum outro sistema ocupando a porta 3000, a visualização de PDF não irá ocorrer como esperado, fecha a outra aplicação ou altere a linha 110 do arquivo src/app/annotation/page.js.

### Preparando o ambiente

Primeiro é necessário instalar os pacotes para execução do software

```bash
npm install
```

Executando o ambiente de desenvolvimento local:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para verificar a página de anotação.
