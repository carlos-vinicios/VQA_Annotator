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
import {
  CheckBoxRounded,
  Delete,
  ExpandMore,
  RemoveRedEye,
} from "@mui/icons-material";
import InteractionDialog from "@/components/interactionDialog";

export default function Annotation() {
  const [reportFile, setReportFile] = useState({});
  const [QAS, setQAS] = useState([]);
  const [expandedAccordion, setExpandedAccordion] = useState(0);
  const [dialogData, setDialogData] = useState({
    open: false,
    qaIndex: null,
    callback: null,
    messages: { title: "", body: "" },
  });
  const [finishSelection, setFinishSelection] = useState(false);

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
      setReportFile({
        ticker: "BBAS3",
        filename: "demonstrativo_2016.pdf",
      });
      //esse atributo color não vai para o banco
      //irei montar a paleta no próprio sistema
      setQAS([
        {
          boxes: [
            {
              x: 0.049475960433483124,
              y: 0.020495763048529625,
              w: 0.5529398918151855,
              h: 0.010957627557218075,
            },
          ],
          color: "#A3A",
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
          color: "#AB3",
          question: "Aqui vai uma pergunta?",
          answer: "Essa certamente é a resposta",
          validated: false,
          deleted: false,
        },
      ]);
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

  const scrollToElement = (index) => {
    const element = document.getElementById(`BB_${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const nextQAAccordion = (qaIndex) => {
    //vai abrir a próxima pergunta que deve ser verificada
    if (qaIndex < QAS.length) setExpandedAccordion(qaIndex + 1);
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
      let prefixTitle = ""
      if(QAS[qaIndex].deleted) prefixTitle = "Restaurar"
      else if(QAS[qaIndex].validated) prefixTitle = "Editar"
      
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
          sx={{ padding: 3, marginTop: 3 }}
          expanded={expandedAccordion === index}
        >
          <AccordionSummary
            onClick={() => handleResetQA(index)}
            expandIcon={<ExpandMore />}
            aria-controls={`question-answer-${index}`}
            id={`question-answer-${index}`}
          >
            <Typography>
              Pergunta {index + 1} {accordionLabel(index, element)}
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
              sx={{ marginBottom: 3 }}
            />
            <TextField
              id={`answer-${index}`}
              fullWidth
              variant="outlined"
              label="Resposta"
              value={element.answer}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ marginBottom: 3 }}
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

  return (
    <Box pl={3} pr={3} mt={3} mb={3}>
      <FinishModal open={finishSelection} />
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
          backgroundColor: "#FFF",
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
        {generateQAAccordions()}
      </Box>
    </Box>
  );
}
