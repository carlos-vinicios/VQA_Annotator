"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Grid,
  Box,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import evaluationService from "@/services/api/evaluationService";
import documentService from "@/services/api/documentService";
import PdfViewer from "@/components/pdfViewer";
import FinishModal from "@/components/finishModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore } from "@mui/icons-material";
import InteractionDialog from "@/components/interactionDialog";
import LoadBackdrop from "@/components/loadBackdrop";
import SideMenu from "@/components/sideMenu";

export default function DocumentView() {
  const params = useParams();
  const router = useRouter();
  const evaluationSteps = {
    coherent: "A pergunta é coerente?",
    correct: "A resposta está correta?",
  };

  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.up("xs"));
  const tabletMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const computerMatches = useMediaQuery(theme.breakpoints.up("lg"));

  const [viewMode, setViewMode] = useState(true);
  const [reportFile, setReportFile] = useState({});
  const [QAS, setQAS] = useState([]);
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
  const colorPallete = [
    "rgba(250, 92, 92, 0.3)",
    "rgba(247, 207, 114, 0.3)",
    "rgba(51, 110, 131, 0.3)",
    "rgba(169, 187, 51, 0.3)",
    "rgba(160, 23, 138, 0.3)",
    "rgba(5, 245, 237, 0.3)",
  ];

  const getNewPageForEvaluation = () => {
    const elementContainer = document.getElementById("qas-container");
    elementContainer.scrollTop = 0;

    evaluationService
      .getNextEvaluationFile()
      .then((data) => {
        setViewMode(false);
        setReportFile(data);
        setQAS(
          data.questions.map((element, index) => {
            let newElementValue = {
              ...element,
              vote: {
                coherent: null,
                correct: null,
              },
              color: colorPallete[index],
            };
            return newElementValue;
          })
        );
        setIsDataLoading(false);
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 404) {
          setFinishAnnotation(true);
          return;
        }
      });
  };

  const getFileToView = () => {
    documentService
      .getFileToVisualize(params.file_id.replace("ed_", ""))
      .then((data) => {
        if (params.file_id.includes("ed_")) setViewMode(false);
        else setViewMode(true);

        setReportFile(data);
        setQAS(
          data.questions.map((element, index) => {
            let newElementValue = {
              ...element,
              vote: {
                coherent: null,
                correct: null,
              },
              color: colorPallete[index],
            };
            return newElementValue;
          })
        );
        setIsDataLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (params.file_id === "evaluation") getNewPageForEvaluation();
    else getFileToView();
  }, []);

  const backToResume = () => {
    router.push("/resume");
  };

  const saveEvaluations = () => {
    //aqui só vou enviar os dados para a rota de registro de anotação do backend
    setIsDataLoading(true);
    let votes = [];
    for (let i = 0; i < QAS.length; i++) {
      //transforma os valores dos votos em booleano para adequar ao schema da API
      Object.keys(QAS[i].vote).forEach((key) => {
        QAS[i].vote[key] = QAS[i].vote[key] === true;
      });
      votes.push({ ...QAS[i].vote, model: "human" });
    }

    evaluationService.saveEvaluations(reportFile.file_id, votes).then(() => {
      if (params.file_id !== undefined && params.file_id.includes("ed_")) {
        //interrompe a execução do código em caso de edição
        alert("Atualização realizada com sucesso.");
        router.push("/resume");
        return;
      } else {
        getNewPageForEvaluation();
      }
    });
  };

  const scrollToElement = (index) => {
    if (index >= QAS.length) return;

    if (QAS[index].answer_bboxes.length <= 0) return;
    let box = QAS[index].answer_bboxes[0];
    let boxY = box[1];
    let boxX = box[0];
    let coordY = boxY * reportFile.page_size.height - 50;
    let coordX = boxX * reportFile.page_size.width - 50;

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

  const updateEvaluation = (qa_index, eval_key, response) => {
    //atualiza os valores e votos do segundo nível da estrutura de voto
    let newVote = {
      ...QAS[qa_index].vote,
    };
    newVote[eval_key] = response === "true";

    //se não for coerente, reseta automaticamente a resposta
    if (eval_key === "coherent" && !(response === "true"))
      newVote.correct = null;

    setQAS((prevItems) =>
      prevItems.map((item, index) =>
        index === qa_index
          ? {
              ...item,
              vote: newVote,
            }
          : item
      )
    );
  };

  const mapEvaluationRelations = (qa_index, key) => {
    //fornece a relação atual e mapeia-se as dependências hierarquicas delas
    switch (key) {
      case "coherent":
        return false;
      case "relevant":
      case "correct":
        return !QAS[qa_index].vote.coherent;
    }
  };

  const evaluationBox = (qa_index) => {
    return (
      <Grid container>
        {Object.keys(evaluationSteps).map((key, index) => {
          let lastKey = null;
          if (index > 0) lastKey = Object.keys(evaluationSteps)[index - 1];
          if (index > 0 && !QAS[qa_index].vote[lastKey]) return <></>;
          else
            return (
              <Grid item sm={12} lg={4} mt={3}>
                <FormControl display="flex">
                  <FormLabel
                    id="qa-eval-radio-buttons-group"
                    sx={{ color: "#000" }}
                  >
                    {evaluationSteps[key]}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="qa-eval-radio-buttons-group"
                    name={`${key}_evaluation_${qa_index}`}
                    value={QAS[qa_index].vote[key]}
                    onChange={(event, newValue) => {
                      updateEvaluation(qa_index, key, newValue);
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Sim"
                      disabled={mapEvaluationRelations(qa_index, key)}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Não"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            );
        })}
      </Grid>
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
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`question-answer-${index}`}
            id={`question-answer-${index}`}
          >
            <Typography>Pergunta e Resposta {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Pergunta: {element.question}</Typography>
            <Box display="flex" sx={{ mt: 2 }} alignItems="center">
              <Typography>Resposta: {element.answer}</Typography>
              <Button onClick={() => scrollToElement(index)} sx={{ ml: 2 }}>
                Ver resposta
              </Button>
            </Box>
            {!viewMode && evaluationBox(index)}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  const validationChecker = (questions) => {
    return questions.every(
      (question) =>
        question.vote.coherent !== null &&
        ((question.vote.coherent === true && question.vote.correct !== null) ||
          (question.vote.coherent === false && question.vote.correct === null))
    );
  };

  const closeFinishModal = () => {
    setFinishAnnotation(false);
    setIsDataLoading(false);
  };

  return (
    <Box pl={3} pr={3} mt={3} mb={3}>
      <SideMenu matchers={{ mobileMatches, tabletMatches, computerMatches }} />
      <FinishModal open={finishAnnotation} closeCallback={closeFinishModal} />
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
                {reportFile !== undefined &&
                  Object.keys(reportFile).length > 0 && (
                    <PdfViewer
                      filePath={`${process.env.NEXT_PUBLIC_API_HOST}/document/${reportFile.file_id}`}
                      pageNumber={reportFile.page}
                      pageWidth={reportFile.page_size.width}
                      QAS={QAS}
                      matchers={{
                        mobileMatches,
                        tabletMatches,
                        computerMatches,
                      }}
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
        id="qas-container"
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
            fullWidth={(mobileMatches || tabletMatches) && !computerMatches}
            onClick={backToResume}
            sx={{
              mr: (mobileMatches || tabletMatches) && !computerMatches ? 0 : 4,
              mb: (mobileMatches || tabletMatches) && !computerMatches ? 4 : 0,
            }}
          >
            Voltar
          </Button>
          {!viewMode && (
            <Button
              variant="contained"
              color="success"
              fullWidth={(mobileMatches || tabletMatches) && !computerMatches}
              disabled={!validationChecker(QAS)}
              onClick={saveEvaluations}
            >
              Salvar
            </Button>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
