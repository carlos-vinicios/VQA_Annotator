"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import annotationServices from "@/services/api/annotationServices";
import PdfViewer from "@/components/pdfViewer";
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
import LoadBackdrop from "@/components/loadBackdrop";
import SideMenu from "@/components/sideMenu";

export default function Annotation() {
  const { data: session, status } = useSession();

  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.up("xs"));
  const tabletMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const computerMatches = useMediaQuery(theme.breakpoints.up("lg"));

  const [reportFile, setReportFile] = useState({});
  const [QAS, setQAS] = useState([]);
  const [expandedAccordion, setExpandedAccordion] = useState(-1);
  const [documentPosition, setDocumentPosition] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });
  const [dialogData, setDialogData] = useState({
    open: false,
    qaIndex: null,
    callback: null,
    messages: { title: "", body: "" },
  });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [finishAnnotation, setFinishAnnotation] = useState(false);
  const [strtTime, setStrtTime] = useState(new Date());
  const colorPallete = [
    "rgba(245, 141, 5, 0.3)",
    "rgba(247, 207, 114, 0.3)",
    "rgba(51, 110, 131, 0.3)",
    "rgba(169, 187, 51, 0.3)",
    "rgba(160, 23, 138, 0.3)",
    "rgba(5, 245, 237, 0.3)",
  ];

  const getNewPageForAnnotation = () => {
    if (session) {
      setExpandedAccordion(0);
      annotationServices.getNextFile(session.user.token).then((data) => {
        if (Object.keys(data).length === 0) {
          setFinishAnnotation(true);
          return;
        }
        setStrtTime(new Date());
        setReportFile(data);
        setQAS(
          data.qas.map((element, index) => {
            let newElementValue = {
              question: element.model_question,
              answer: element.model_answer,
              boxes: [
                ...JSON.parse(JSON.stringify(element.questions_boxes)),
                ...JSON.parse(JSON.stringify(element.answer_boxes)),
              ],
              color: colorPallete[index],
              validated: false,
              deleted: false,
            };
            return newElementValue;
          })
        );
        setIsDataLoading(false);
      });
    }
  };

  useEffect(() => {
    getNewPageForAnnotation();
  }, [status]);

  const saveAnnotations = () => {
    //aqui só vou enviar os dados para a rota de registro de anotação do backend
    setIsDataLoading(true);
    let newQAs = [];
    for (let i = 0; i < QAS.length; i++) {
      const user_element = QAS[i];
      const model_element = reportFile.qas[i];
      newQAs.push({
        ...model_element,
        user_question: user_element.question,
        user_answer: user_element.answer,
        validated: user_element.validated,
        deleted: user_element.deleted,
      });
    }

    annotationServices
      .saveAnnotations({
        ...reportFile,
        elapsedTime: new Date() - strtTime,
        qas: newQAs,
        annotated: true,
      })
      .then(() => {
        getNewPageForAnnotation();
      });
  };

  const scrollToElement = (index) => {
    let box = QAS[index].boxes[0];
    let boxY = box.y;
    let boxX = box.x;
    let coordY = boxY * reportFile.dimension.height - 50;
    let coordX = boxX * reportFile.dimension.width - 50;
    if ((mobileMatches || tabletMatches) && !computerMatches) {
      setDocumentPosition({
        scale: 1,
        translation: { x: -coordX, y: -coordY },
      });
    } else {
      const element = document.getElementById(`BB_${index}`);
      if (element) {
        window.scrollTo({
          top: coordY,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  };

  const nextQAAccordion = (qaIndex) => {
    //vai abrir a próxima pergunta que deve ser verificada
    if (qaIndex < QAS.length) {
      let nextIndex = qaIndex;
      //vamos buscar pela QA que ainda não foi validada
      for (let i = nextIndex; i < QAS.length; i++) {
        const element = QAS[i];
        if (!element.validated) {
          break;
        }
        nextIndex += 1;
      }
      scrollToElement(nextIndex);
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
          body: `Tem certeza que deseja ${prefixTitle.toLowerCase()} a pergunta ${qaIndex + 1}?`,
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

  const updateQA = (qaIndex, atrib, value) => {
    setQAS(
      QAS.map((element, index) => {
        if (qaIndex === index) {
          element[atrib] = value;
        }
        return element;
      })
    );
  };

  const generateQAAccordions = () => {
    return QAS.map((element, index) => {
      return (
        <Accordion
          key={index}
          sx={{
            padding:
              (mobileMatches || tabletMatches) && !computerMatches ? 1 : 3,
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
              variant="outlined"
              label="Pergunta"
              value={element.question}
              onChange={(e) => updateQA(index, "question", e.target.value)}
              sx={{ marginBottom: 3, backgroundColor: "#fafafa" }}
            />
            <TextField
              id={`answer-${index}`}
              fullWidth
              variant="outlined"
              label="Resposta"
              value={element.answer}
              onChange={(e) => updateQA(index, "answer", e.target.value)}
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
    <Box pl={3} pr={3} mt={3} mb={3}>
      <SideMenu matchers={{ mobileMatches, tabletMatches, computerMatches }} />
      <FinishModal open={finishAnnotation} />
      <LoadBackdrop open={isDataLoading} message={"Carregando Dados"} />
      <InteractionDialog
        open={dialogData.open}
        index={dialogData.qaIndex}
        messages={dialogData.messages}
        closeCallback={dialogData.callback}
      />
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item sm={12} lg={10}>
          <Paper elevation={2} sx={{ paddingBottom: 3, mt: 10 }}>
            <Grid
              container
              spacing={2}
              pl={3}
              pr={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                container
                xs={12}
                sm={12}
                lg={12}
                alignItems="center"
                justifyContent="center"
              >
                {Object.keys(reportFile).length > 0 && (
                  <PdfViewer
                    filePath={`${process.env.NEXT_PUBLIC_REPORT_ENDPOINT}/${reportFile.ticker}/${reportFile.filename}`}
                    pageNumber={reportFile.page}
                    pageWidth={reportFile.dimension.width}
                    QAS={QAS}
                    matchers={{ mobileMatches, tabletMatches, computerMatches }}
                    mobilePositionControl={{
                      documentPosition,
                      setDocumentPosition,
                    }}
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
          height: "46vh",
          overflowY: "scroll",
          overflowX: "hidden",
          bottom: 0,
          left: 0,
          padding: 3,
          pl: (mobileMatches || tabletMatches) && !computerMatches ? 3 : 10,
          zIndex: 9,
          boxShadow: 3,
        }}
      >
        <Typography
          variant={
            (mobileMatches || tabletMatches) && !computerMatches ? "h5" : "h4"
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
            onClick={saveAnnotations}
          >
            Salvar
          </Button>
        </Grid>
      </Box>
    </Box>
  );
}
