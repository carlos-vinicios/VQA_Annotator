"use client";

import { Container, Box, Typography } from "@mui/material";
import Image from "next/image";
import styles from "./styles.module.css";

export default function Manual() {
  const components_spaces = {
    mb: 3,
  };
  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h3" component="h3" gutterBottom>
        Manual para Anotação
      </Typography>
      <Typography variant="h4" component="h4" sx={components_spaces}>
        Tela de Resumo
      </Typography>
      <Typography sx={components_spaces}>
        Assim que realizar o login, você será direcionado para a tela de resumo
        das anotações. Nessa tela encontra-se um campo de texto para busca e uma
        tabela que lista os arquivos que já foram validados. Inicialmente, essa
        tabela estará vazia, sendo preenchida a medida que você evolua no
        processo de anotação.
      </Typography>
      <Box sx={components_spaces}>
        <Image
          src="/resume_page_view.png"
          alt="Visão geral da página de resumo"
          width={1100}
          height={500}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
      <Typography>
        Explicando as principais funcionalidades encontradas nessa tela:
      </Typography>
      <Box component="ul" className={styles.list_container}>
        <Typography component="li">
          Botão para visualização de uma validação já realizada. Temos um botão
          para cada arquivo.
        </Typography>
        <Typography component="li">
          Botão para edição de uma validação já realizada. Temos um botão para
          cada arquivo.
        </Typography>
        <Typography component="li">
          Botão para iniciar o processo de validação dos arquivos (
          <span>VALIDAR ARQUIVOS</span>). Que deve ser clicado para iniciar o
          processo de validação.
        </Typography>
      </Box>
      <Box sx={components_spaces}>
        <Image
          src="/resume_view_simple_guide.png"
          alt="Visão geral da página de resumo, com a explicação de cada um dos botões existentes"
          width={1100}
          height={500}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
      <Typography variant="h4" component="h4" sx={components_spaces}>
        Anotação e Validação
      </Typography>
      <Typography>
        Seu objetivo é analisar as perguntas e respostas que serão exibidas,
        julgando se a{" "}
        <span className={styles.text_bold}>pergunta é coerente</span> e se a{" "}
        <span className={styles.text_bold}>resposta apresentada é correta</span>
        . Você deve utilizar os seguintes{" "}
        <span className={styles.text_bold}>critérios</span> para analisar a
        coerência de uma pergunta:
      </Typography>
      <Box component="ul" className={styles.list_container}>
        <Typography component="li">
          A pergunta permite a compreensão textual do leitor, apresentando uma
          combinação de palavras com conteúdo claro, lógico e direto;
        </Typography>
        <Typography component="li">
          A pergunta segue as regras da gramática normativa da lingua
          portuguesa;
        </Typography>
        <Typography component="li">
          A pergunta não apresenta ambiguidade possibilitando a identificação
          clara da sua resposta;
        </Typography>
        <Typography component="li">
          A pergunta está diretamente relacionada ao texto de referência;
        </Typography>
        <Typography component="li">
          A pergunta pode ser respondida diretamente pelo texto de referência;
        </Typography>
        <Typography component="li">
          A pergunta possui uma única resposta baseada no texto de referência.
          Especialmente para tabelas que apresentem informações para
          "Controladora" ou "Consolidado" ou informações por ano.
        </Typography>
      </Box>
      <Typography>
        Para analisar a resposta, você deve considerar os seguintes{" "}
        <span className={styles.text_bold}>critérios</span>:
      </Typography>
      <Box component="ul" className={styles.list_container}>
        <Typography component="li">
          Não considerar as ausências ou presenças das unidades de medidas,
          unidades monetárias, simbolos matemáticos ou parenteses e colchetes;
        </Typography>
        <Typography component="li">
          Perguntas que apresentam o advérbio interrogativo "Quando", devem
          apresentar uma resposta indicando valor ou termo temporal presente no
          texto de referência;
        </Typography>
        <Typography component="li">
          Perguntas que apresentam o advérbio interrogativo "Quem", devem
          apresentar uma resposta indicando um substantivo próprio (pessoa ou
          empresa);
        </Typography>
        <Typography component="li">
          Perguntas que apresentam o advérbio interrogativo "Onde", devem
          apresentar uma resposta indicando uma cidade, estado, país ou
          endereço;
        </Typography>
        <Typography component="li">
          A resposta deve ser coerente e utilizar somente o próprio texto de
          referência na sua construção. Não deve utilizar qualquer tipo de
          argumento ou informações externas ao texto;
        </Typography>
        <Typography component="li">
          A resposta deve atender completamente a pergunta. Respostas parciais
          ou que deixem algum dos elementos solicitados devem ser marcadas como
          incorreta.
        </Typography>
      </Box>
      <Typography variant="h5" component="h5" sx={components_spaces}>
        Exemplificando a avaliação:
      </Typography>
      <Typography sx={components_spaces}>
        Considerando o fragmento de documento abaixo:
      </Typography>
      <Box display="flex" justifyContent="center">
        <Image
          src="/example_table.png"
          alt="Fragmento de documento de exemplo"
          width={900}
          height={500}
          style={{
            width: "80%",
            height: "auto",
          }}
        />
      </Box>
      <Typography sx={{ mt: 3 }}>
        Supondo que tenhamos as seguintes perguntas e respostas para essa
        tabela:
      </Typography>
      <Box component="ul" className={styles.list_container}>
        <Typography component="li">
          Pergunta: Qual o valor de caixa e equivalente de caixa em 31/12/2022?
          <br />
          Reposta: 108
        </Typography>
        <Typography component="li">
          Pergunta: Qual o valor de títulos e valores mobiliários no
          Consolidado?
          <br />
          Reposta: 328.112
        </Typography>
      </Box>
      <Typography>
        Ambas as perguntas{" "}
        <span className={styles.text_bold}>não são coerentes</span>, pois as
        perguntas podem ser respondidas por duas partes da tabela. A primeira
        pergunta pode ser respondida tanto com o valor do consolidado, como o
        valor da controladora. Nesses casos,{" "}
        <span className={styles.text_bold}>
          devemos marcar a pergunta como não coerente
        </span>
        . Perguntas ou respostas que contenham os seguintes elementos também
        devem ser marcadas como incoerentes ou incorretas:
      </Typography>
      <Box component="ul" className={styles.list_container}>
        <Typography component="li">
          Pergunta: Onde está sendo exibido o valor total dos ativos
          financeiros?
          <br />
          Reposta: TABELA 1
        </Typography>
        <Typography component="li">
          Pergunta: Qual o valor de titulos e valores mobiliários exibidos na
          TABELA 1 para o consolidado em 31/12/2021?
          <br />
          Reposta: 328.112
        </Typography>
        <Typography component="li">
          Pergunta: Onde está o texto que explica sobre assunto tal?
          <br />
          Reposta: T5
        </Typography>
      </Box>
      <Typography sx={components_spaces}>
        Preste bastante atenção nesses quesitos, pois eles são cruciais para a
        seleção das melhores perguntas e respostas para treinamento de modelos
        especialistas.
      </Typography>
      <Typography variant="h5" component="h5" sx={components_spaces}>
        Tela de Anotação e Validação
      </Typography>
      <Typography sx={components_spaces}>
        A tela de anotação e edição de uma validação são similares. Elas
        apresentam a página de um documento e as perguntas e respostas
        relacionadas a ele. A paǵina também apresenta dois botões: voltar e
        salvar. O <span className={styles.text_bold}>VOLTAR</span> redireciona o
        usuário para a tela de resumo de anotações. O{" "}
        <span className={styles.text_bold}>SALVAR</span> é responsável por
        registrar sua validação na base de dados, sendo liberado após a
        validação de cada uma das perguntas e respostas.
      </Typography>
      <Image
        src="/validation_page.png"
        alt="Visão geral da página de validação."
        width={1100}
        height={500}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <Typography sx={{ ...components_spaces, mt: 3 }}>
        Cada pergunta e resposta pode ser expandida para mostrar o seu conteúdo.
        Além do conteúdo, ela apresenta um botão{" "}
        <span className={styles.text_bold}>VER RESPOSTA</span>. Que deslocará o
        documento para região mais próxima ao texto de resposta. Nem todas as
        respostas terão suas regiões corretamente marcada, por isso,{" "}
        <span className={styles.text_bold}>
          análise a região sinalizada com cuidado
        </span>
        . Quando não houver uma região sinalizada,{" "}
        <span className={styles.text_bold}>
          leia o documento com atenção em busca da resposta
        </span>
        . Além disso, cada pergunta também apresenta a opção de votação para
        saber se a pergunta é coerente. Caso a pergunta seja coerente, uma nova
        opção de votação será exibida para que você avalie a resposta.
      </Typography>
      <Image
        src="/question_eval.png"
        alt="Validação de uma pergunta ou resposta."
        width={1100}
        height={500}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{ ...components_spaces, mt: 3 }}
      >
        Dispositivo Móvel
      </Typography>
      <Typography sx={{ ...components_spaces, mt: 3 }}>
        Caso esteja utilizando um dispositivo movél, utilize o movimento de
        pinça para aumentar ou reduzir o zoom. Você também poderá arrastar o
        documento para ajustar a visualização em alguma área.
      </Typography>
    </Container>
  );
}
