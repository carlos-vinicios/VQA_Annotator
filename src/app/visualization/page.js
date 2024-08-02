"use client";

import { useState } from "react";
import { useParams } from 'next/navigation'
import {
  Grid,
  Box,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import evaluationService from "@/services/api/evaluationService";
import PdfViewer from "@/components/pdfViewer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, RemoveRedEye } from "@mui/icons-material";
import LoadBackdrop from "@/components/loadBackdrop";
import SideMenu from "@/components/sideMenu";

export default function Visualization() {
  const params = useParams()

  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.up("xs"));
  const tabletMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const computerMatches = useMediaQuery(theme.breakpoints.up("lg"));

  const [filename, setFilename] = useState("");
  const [generationModel, setGenerationModel] = useState("");
  const [reportFile, setReportFile] = useState({});
  const [QAS, setQAS] = useState([]);
  const [documentPosition, setDocumentPosition] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  const colorPallete = [
    "rgba(250, 92, 92, 0.3)",
    "rgba(247, 207, 114, 0.3)",
    "rgba(51, 110, 131, 0.3)",
    "rgba(169, 187, 51, 0.3)",
    "rgba(160, 23, 138, 0.3)",
    "rgba(5, 245, 237, 0.3)",
  ];

  const getFileToView = () => {
    setIsDataLoading(true);
    const elementContainer = document.getElementById("qas-container");
    elementContainer.scrollTop = 0;
    evaluationService
      .getFileToVisualize(filename, generationModel)
      .then((data) => {
        console.log(data);
        setReportFile(data);
        setQAS(
          data.questions.map((element, index) => {
            let newElementValue = {
              ...element,
              vote: {
                coherent: false,
                relevant: false,
                correct: false,
              },
              validated: false,
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

  const handleChangeFilename = (event) => {
    setFilename(event.target.value);
  };

  const handleChangeGenerationModel = (event) => {
    setGenerationModel(event.target.value);
  };

  const avaiableGenerationModels = () => {
    //TODO: colocar essa listagem para o backend
    const models = [
      "",
      "gemini-1.5-flash-001",
      "claude-3-haiku-20240307",
      "llama3-70b-8192",
      "gpt-3.5-turbo",
      "gpt-4o-mini",
    ];
    return models;
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
            <Typography>Resposta: {element.answer}</Typography>

            <Box sx={{ justifyContent: "space-between" }}>
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
      <SideMenu matchers={{ mobileMatches, tabletMatches, computerMatches }} />
      <LoadBackdrop open={isDataLoading} message={"Carregando Dados"} />
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item sm={12} lg={10}>
          <Box sx={{ mt: 8 }} alignItems="center" justifyContent="center">
            <TextField
              label="Buscar arquivo"
              id="file-search"
              sx={{ width: "50vh" }}
              value={filename}
              onChange={handleChangeFilename}
            />
            <FormControl sx={{ minWidth: "50vh", ml: 2 }}>
              <InputLabel>Modelo Gerador</InputLabel>
              <Select
                labelId="generation-model-select-label"
                id="generation-model-select"
                value={generationModel}
                label="Modelo Gerador"
                onChange={handleChangeGenerationModel}
              >
                <MenuItem value=""></MenuItem>
                {avaiableGenerationModels().map((value, index) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ ml: 2 }} onClick={getFileToView}>
              Buscar
            </Button>
          </Box>
        </Grid>
        <Grid item sm={12} lg={10}>
          <Paper elevation={2} sx={{ paddingBottom: 3, mt: 2 }}>
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
          height: "30vh",
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
        {/* <Typography
          variant={
            (mobileMatches || tabletMatches) && !computerMatches ? "h5" : "h4"
          }
          sx={{ textAlign: "center", mb: 3 }}
        >
          Perguntas e Respostas
        </Typography> */}
        {generateQAAccordions()}
      </Box>
    </Box>
  );
}
