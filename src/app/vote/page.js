"use client";

import { useState, useEffect } from "react";
import {
  Grid, Box, Paper, Rating, Button,
  IconButton, Accordion, AccordionSummary,
  AccordionDetails, Typography,
} from "@mui/material";
import voteService from "@/services/api/voteService";
import PdfViewer from "@/components/pdfViewer";
import FinishModal from "@/components/finishModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  CheckBoxRounded, ExpandMore, RemoveRedEye,
} from "@mui/icons-material";
import InteractionDialog from "@/components/interactionDialog";
import LoadBackdrop from "@/components/loadBackdrop";
import SideMenu from "@/components/sideMenu";

export default function Annotation() {
  const overallVote = {
    overall: "Relevância"
  }

  const questionVotes = {
    coherence: "Coerência", 
    objectivity: "Objetividade"
  }

  const answerVotes = {
    coherence: "Coerência", 
    objectivity: "Objetividade",
    accuracy: "Acurácia"
  }

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
    "rgba(250, 92, 92, 0.3)",
    "rgba(247, 207, 114, 0.3)",
    "rgba(51, 110, 131, 0.3)",
    "rgba(169, 187, 51, 0.3)",
    "rgba(160, 23, 138, 0.3)",
    "rgba(5, 245, 237, 0.3)",
  ];

  const getNewPageForVote = () => {
    const elementContainer = document.getElementById("qas-container");
    elementContainer.scrollTop = 0;
    setExpandedAccordion(0);
  
    voteService.getNextVoteFile().then((data) => {
      if (Object.keys(data).length === 0 || typeof data === "string") {
        setFinishAnnotation(true);
        return;
      }
      setStrtTime(new Date());
      setReportFile(data);
      setQAS(
        data.questions.map((element, index) => {
          let newElementValue = {
            ...element,
            vote: {
              overall: 0,
              question: {
                coherence: 0, 
                objectivity: 0
              },           
              answer: {
                coherence: 0, 
                objectivity: 0,
                accuracy: 0
              }
            },
            validated: false,
            color: colorPallete[index],
          };
          return newElementValue;
        })
      );
      setIsDataLoading(false);
    });
  }

  useEffect(() => {
    getNewPageForVote();
  }, []);

  const saveVotes = () => {
    //aqui só vou enviar os dados para a rota de registro de anotação do backend
    setIsDataLoading(true);
    let votes = [];
    for (let i = 0; i < QAS.length; i++) {
      votes.push({...QAS[i].vote, model: "human"})
    }
    
    voteService
      .saveVotes(
        reportFile.file_id,
        votes
      )
      .then(() => {
        getNewPageForVote();
      });
  };

  const scrollToElement = (index) => {
    if (index >= QAS.length) return;

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
        }
        return qa;
      });
      setQAS(newQAs);
      setExpandedAccordion(qaIndex);
    }
  };

  const handleResetQA = (qaIndex) => {
    //vai ser chamado quando uma questão invalidada for clicada novamente e confirmada o popup
    if (QAS[qaIndex].validated) {
      const prefixTitle = "Editar";
      
      setDialogData({
        open: true,
        qaIndex: qaIndex,
        callback: resetQA,
        messages: {
          title: `${prefixTitle} pergunta ${qaIndex + 1}`,
          body: `Tem certeza que deseja ${prefixTitle.toLowerCase()} a votação da pergunta ${
            qaIndex + 1
          }?`,
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

  const getVoteRegion = (region) => {
    var voteRegion = ''
    var voteObject = {}
    switch (region) {
      case "Pergunta":
        voteRegion = 'question'
        voteObject = questionVotes
        break
      case "Resposta":
        voteRegion = 'answer'
        voteObject = answerVotes
        break
      case "Visão Geral":
        voteRegion = 'overall'
        voteObject = overallVote
        break
    }

    return {voteRegion, voteObject}
  }

  const voteRegion = (qa_index, region) => {
    const {voteRegion, voteObject} = getVoteRegion(region)
    return (
      <Box component="fieldset" sx={{borderRadius: 1, padding: 2, mt: 2}}>
        <legend>{region}</legend>
        <Box display="flex" alignItems="center" key={`${qa_index}_${region}`}>
          {Object.keys(voteObject).map((key, index) => {
            return voteBox(qa_index, region, key, voteObject[key])
          })}
        </Box>
      </Box>
    )
  }

  const updateSubVotes = (qa_index, voteField, field, newValue) => {
    //atualiza os valores e votos do segundo nível da estrutura de voto
    setQAS((prevItems) => prevItems.map((item, index) => 
      index === qa_index ? {
        ...item,
        vote: {
          ...item.vote,
          [voteField]: {
            ...item.vote[voteField], 
            [field]: newValue
          } 
        }
      } : item
    ))
  }

  const updateVote = (qa_index, voteField, newValue) => {
    //atualiza os valores de votos do primeiro nível da estrutura de voto
    setQAS((prevItems) => prevItems.map((item, index) => 
      index === qa_index ? {
        ...item,
        vote: {
          ...item.vote,
          [voteField]: newValue
        }
      } : item
    ))
  }

  const voteBox = (qa_index, region, field, fieldLabel) => {
    const {voteRegion, voteObject} = getVoteRegion(region)
    
    return (
      <Box display="flex" alignItems="center" sx={{ml: 2}}>
        <Typography sx={{mr: 1}}>{fieldLabel}: </Typography>  
        <Rating 
          name={`${region}_${field}_vote`}
          value={voteRegion === field ? 
              QAS[qa_index].vote[voteRegion] : 
              QAS[qa_index].vote[voteRegion][field]
          }
          onChange={(event, newValue) => {
            voteRegion === "overall" ? updateVote(qa_index, voteRegion, newValue) :
            updateSubVotes(qa_index, voteRegion, field, newValue)
          }}
        />
      </Box>
    )
  }
  
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
            <Typography>{element.question}</Typography>
            <Typography>{element.answer}</Typography>
            {voteRegion(index, "Visão Geral")}
            {voteRegion(index, "Pergunta")}
            {voteRegion(index, "Resposta")}            
            
            <Box sx={{ justifyContent: "space-between" }}>
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
                    filePath={`${process.env.NEXT_PUBLIC_API_HOST}/document/${reportFile.file_id}`}
                    pageNumber={reportFile.page}
                    pageWidth={reportFile.page_size.width}
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
            color="success"
            fullWidth={(mobileMatches || tabletMatches) && !computerMatches}
            disabled={!validationChecker(QAS)}
            onClick={saveVotes}
          >
            Salvar
          </Button>
        </Grid>
      </Box>
    </Box>
  );
}
