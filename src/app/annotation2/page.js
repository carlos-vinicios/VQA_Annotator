"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import selectorServices from "@/services/api/selectorServices";
import PdfViewer from "@/components/pdfViewer2";
import FinishModal from "@/components/finishModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  CheckBoxRounded,
  Delete,
  ExpandMore,
  RemoveRedEye,
} from "@mui/icons-material";
import InteractionDialog from "@/components/interactionDialog";

export default function Annotation() {
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.up("xs"));
  const tabletMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const computerMatches = useMediaQuery(theme.breakpoints.up("lg"));

  const [reportFile, setReportFile] = useState({});
  const [QAS, setQAS] = useState([]);
  const [expandedAccordion, setExpandedAccordion] = useState(0);
  const [dialogData, setDialogData] = useState({
    open: false,
    qaIndex: null,
    callback: null,
    messages: { title: "", body: "" },
  });
  const [finishAnnotation, setFinishAnnotation] = useState(false);
  const colorPallete = [
    "rgba(245, 141, 5, 0.3)",
    "rgba(247, 207, 114, 0.3)",
    "rgba(51, 110, 131, 0.3)",
    "rgba(169, 187, 51, 0.3)",
    "rgba(160, 23, 138, 0.3)",
    "rgba(5, 245, 237, 0.3)",
  ];

  useEffect(() => {
    if (Object.keys(reportFile).length === 0) {
      //   selectorServices.getNextReport().then((data) => {
      //     if (typeof data === "string") {
      //       alert(data);
      //       setFinishSelection(true);
      //       return;
      //     }
      //     if (Object.keys(data).length > 0) {
      //       setReportFile(data);
      //     }
      //   });
      let data = [
        {
          boxes: [
            {
              x: 0.049475960433483124,
              y: 0.020495763048529625,
              w: 0.5529398918151855,
              h: 0.010957627557218075,
            },
          ],
          question: "Aqui vai uma pergunta?",
          answer: "Essa certamente é a resposta",
          validated: false,
          deleted: false,
        },
        {
          boxes: [
            {
              x: 0.1189112663269043,
              y: 0.34039339423179626,
              w: 0.8077865242958069,
              h: 0.011120125651359558,
            },
          ],
          question: "Aqui vai uma pergunta?",
          answer: "Essa certamente é a resposta",
          validated: false,
          deleted: false,
        },
      ];
      setReportFile({
        ticker: "BBAS3",
        filename: "demonstrativo_2016.pdf",
      });

      setQAS(
        data.map((element, index) => {
          element.color = colorPallete[index];
          return element;
        })
      );
    }
  }, [reportFile]);

  // const pageChanged = (pageNumber, pageMetadata) => {
  //   if (pageNumber <= metadatas.length) {
  //     metadatas[pageNumber - 1] = pageMetadata;
  //     setMetadatas(metadatas);
  //   } else {
  //     setMetadatas((prev) => [...prev, pageMetadata]);
  //   }
  // };

  // const sendPageMetadata = (pageMetadata) => {
  //   // console.log("Metadados enviados", [...metadatas, pageMetadata])
  //   selectorServices
  //     .savePageMetadatas({
  //       file_id: reportFile.id,
  //       metadatas: [...metadatas, pageMetadata],
  //     })
  //     .then((data) => {
  //       alert(data);
  //       setReportFile({});
  //       setMetadatas([]);
  //     });
  // };

  const saveAnnotations = () => {
    //aqui só vou enviar os dados para a rota de registro de anotação do backend
  };

  const scrollToElement = (index) => {
    const element = document.getElementById(`BB_${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const nextQAAccordion = (qaIndex) => {
    //vai abrir a próxima pergunta que deve ser verificada
    if (qaIndex < QAS.length){
      let nextIndex = qaIndex + 1;
      //vamos buscar pela QA que ainda não foi validada
      for (let i = 0; i < QAS.length; i++) {
        const element = QAS[i];
        if(!element.validated){
          break
        }
        nextIndex += 1        
      }
      setExpandedAccordion(nextIndex);
    }
  };

  const confirmQA = (qaIndex) => {
    //vai ser disparado quando a confirmação de questão for chamado
    var newQAs = QAS.map((qa, i) => {
      if (i === qaIndex) {
        qa.validated = true;
      }
      return qa;
    });
    setQAS(newQAs);
    nextQAAccordion(qaIndex);
  };

  const deleteQA = (confirmed, qaIndex) => {
    //vai ser disparado quando a deleção de questão for chamada
    setDialogData({
      open: false,
      qaIndex: null,
      callback: null,
      messages: {
        title: "",
        body: "",
      },
    });
    if (confirmed) {
      var newQAs = QAS.map((qa, i) => {
        if (i === qaIndex) {
          qa.validated = true;
          qa.deleted = true;
        }
        return qa;
      });
      setQAS(newQAs);
      nextQAAccordion(qaIndex);
    }
  };

  const handleDeleteQA = (qaIndex) => {
    setDialogData({
      open: true,
      qaIndex: qaIndex,
      callback: deleteQA,
      messages: {
        title: `Excluir pergunta ${qaIndex + 1}`,
        body: `Tem certeza que deseja excluir a pergunta ${qaIndex + 1}?`,
      },
    });
  };

  const resetQA = (confirmed, qaIndex) => {
    setDialogData({
      open: false,
      qaIndex: null,
      callback: null,
      messages: {
        title: "",
        body: "",
      },
    });
    if (confirmed) {
      var newQAs = QAS.map((qa, i) => {
        if (i === qaIndex) {
          qa.validated = false;
          qa.deleted = false;
        }
        return qa;
      });
      setQAS(newQAs);
      setExpandedAccordion(qaIndex);
    }
  };

  const handleResetQA = (qaIndex) => {
    //vai ser chamado quando uma questão invalidada for clicada novamente e confirmada o popup
    if (QAS[qaIndex].deleted || QAS[qaIndex].validated) {
      let prefixTitle = "";
      if (QAS[qaIndex].deleted) prefixTitle = "Restaurar";
      else if (QAS[qaIndex].validated) prefixTitle = "Editar";

      setDialogData({
        open: true,
        qaIndex: qaIndex,
        callback: resetQA,
        messages: {
          title: `${prefixTitle} pergunta ${qaIndex + 1}`,
          body: `Tem certeza que deseja restaurar a pergunta ${qaIndex + 1}?`,
        },
      });
    }
  };

  const accordionLabel = (elementIndex, element) => {
    if (expandedAccordion === elementIndex) return "";
    if (element.deleted) return " - Excluída";
    if (!element.validated) return " - Pendente";
    else return " - Validada";
  };

  const generateQAAccordions = () => {
    return QAS.map((element, index) => {
      return (
        <Accordion
          key={index}
          sx={{
            padding: (mobileMatches || tabletMatches) && !computerMatches ? 1 : 3,
            marginTop: 3,
            backgroundColor: colorPallete[index].replace("0.3", "0.15"),
          }}
          expanded={expandedAccordion === index}
        >
          <AccordionSummary
            onClick={() => handleResetQA(index)}
            expandIcon={<ExpandMore />}
            aria-controls={`question-answer-${index}`}
            id={`question-answer-${index}`}
          >
            <Typography>
              Pergunta e Resposta {index + 1} {accordionLabel(index, element)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id={`question-${index}`}
              fullWidth
              // disabled={true}
              variant="outlined"
              label="Pergunta"
              value={element.question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ marginBottom: 3, backgroundColor: "#fafafa" }}
            />
            <TextField
              id={`answer-${index}`}
              fullWidth
              variant="outlined"
              label="Resposta"
              value={element.answer}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ marginBottom: 3, backgroundColor: "#fafafa" }}
            />
            <Box sx={{ justifyContent: "space-between" }}>
              <IconButton onClick={() => handleDeleteQA(index)}>
                <Delete sx={{ color: "#b00000" }} />
              </IconButton>
              <IconButton
                sx={{ float: "right" }}
                onClick={() => confirmQA(index)}
              >
                <CheckBoxRounded sx={{ color: "#06b000" }} />
              </IconButton>
              <IconButton
                sx={{ float: "right" }}
                onClick={() => scrollToElement(index)}
              >
                <RemoveRedEye />
              </IconButton>
            </Box>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  const validationChecker = (arr) => arr.every((v) => v.validated === true);

  return (
    <Box pl={3} pr={3} mt={3} mb={3} sx={{ backgroundColor: "#FAFAFA" }}>
      <FinishModal open={finishAnnotation} />
      <InteractionDialog
        open={dialogData.open}
        index={dialogData.qaIndex}
        messages={dialogData.messages}
        closeCallback={dialogData.callback}
      />
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item sm={12} lg={10}>
          <Paper elevation={2} sx={{ paddingBottom: 3 }}>
            <Grid
              container
              spacing={2}
              pl={3}
              pr={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} lg={12}>
                {Object.keys(reportFile).length > 0 && (
                  <PdfViewer
                    filePath={`${process.env.NEXT_PUBLIC_REPORT_ENDPOINT}/${reportFile.ticker}/${reportFile.filename}`}
                    pageNumber={182}
                    QAS={QAS}
                    matchers={{mobileMatches, tabletMatches, computerMatches}}
                    focusQA={expandedAccordion}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Box
        elevation={3}
        sx={{
          backgroundColor: "#FAFAFA",
          position: "fixed",
          minWidth: "100%",
          height: "50vh",
          overflowY: "scroll",
          overflowX: "hidden",
          bottom: 0,
          left: 0,
          padding: 3,
          zIndex: 9,
          boxShadow: 3,
        }}
      >
        <Typography
          variant={
            (mobileMatches || tabletMatches) && !computerMatches ? "h5" : "h3"
          }
          sx={{ textAlign: "center", mb: 3 }}
        >
          Perguntas e Respostas
        </Typography>
        {generateQAAccordions()}
        <Grid
          container
          sx={{
            width: "100%",
            mt: 5,
          }}
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            color="success"
            fullWidth={(mobileMatches || tabletMatches) && !computerMatches}
            disabled={!validationChecker(QAS)}
          >
            Salvar
          </Button>
        </Grid>
      </Box>
    </Box>
  );
}
