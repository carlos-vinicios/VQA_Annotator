"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button, Grid, TextField, Box, Typography, Paper } from "@mui/material";
import QuestionList from "@/components/questionsList";
import annotationServices from "@/services/api/annotationServices";
import FinishModal from "@/components/finishModal";
import { redirect } from "next/navigation";
import FloatAlert from "@/components/floatAlert";
import LoadBackdrop from "@/components/loadBackdrop";

export default function Annotation() {
  const { data: session, status } = useSession();
  const questionInputRef = useRef();

  const [loadBackdropOpen, setLoadBackdropOpen] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    message: "",
    severity: "success",
  });

  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [questions, setQuestions] = useState([]);

  const [finishAnnotation, setFinishAnnotation] = useState(false);
  const [reportFile, setReportFile] = useState({});

  //calculo de tempo
  const [startTime, setStartTime] = useState();

  useEffect(() => {
    //caso não esteja logado, volta para autenticação
    if (status === "unauthenticated") {
      redirect("/login");
    }else{ //verifica se o usuário está no estágio correto
      if (session.user.stage !== 'annotation'){
        redirect(`/${session.user.stage}`);
      }
    }
  }, [status]);

  useEffect(() => {
    if (Object.keys(reportFile).length === 0) {
      setLoadBackdropOpen(true);
      annotationServices.getNextFile().then((data) => {
        if (typeof data === "string") {
          setFinishAnnotation(true);
          return;
        } else {
          setReportFile(data);
          setStartTime(new Date());
        }
        setLoadBackdropOpen(false);
      });
    }
  }, [reportFile]);

  const addQuestionAnwser = () => {
    if (question.length > 0 && response.length > 0) {
      if (questions.filter((qa, _) => qa.question === question).length > 0) {
        setAlertInfo({
          message: "Essa pergunta já foi adicionada",
          severity: "warning",
        });
        setAlertOpen(true);
        return;
      }

      setQuestions((prev) => [
        ...prev,
        {
          question,
          response,
        },
      ]);
      setQuestion("");
      setResponse("");
      questionInputRef.current.focus();
    }
  };

  const deleteQuestionAnwser = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveAnnotations = () => {
    if (questions.length > 0) {
      let elapsedTime = new Date() - startTime;
      const timeObj = {
        pageId: reportFile.id,
        annotator: session.user.email,
        elapsedTime,
      };
      const questionObj = {
        pageId: reportFile.id,
        questions,
      };

      annotationServices.saveAnnotations(questionObj).then(() => {
        annotationServices.saveTime(timeObj).then(() => {
          setAlertInfo({
            message: "Anotaçães salvas com sucesso",
            severity: "success",
          });
          setAlertOpen(true);
          //resetando o estado
          setReportFile({});
          setStartTime(null);
          setQuestion("");
          setResponse("");
          setQuestions([]);
        });
      });
    }
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const closeLoadBackdrop = () => {
    setLoadBackdropOpen(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addQuestionAnwser();
    }
  };

  return (
    <Box pl={3} pr={3} mt={3} mb={3}>
      <FinishModal open={finishAnnotation} />
      <FloatAlert
        open={alertOpen}
        closeCallback={closeAlert}
        message={alertInfo.message}
        severity={alertInfo.severity}
      />
      <LoadBackdrop
        open={loadBackdropOpen}
        handleClose={closeLoadBackdrop}
        message="Carregando Arquivo"
      />
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item sm={12} lg={8}>
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
                  <embed
                    style={{
                      width: "100%",
                      height: "90vh",
                    }}
                    src={`${process.env.NEXT_PUBLIC_PAGE_ENDPOINT}/${reportFile.filename}`}
                  />
                )}
                {Object.keys(reportFile).length === 0 && (
                  <Paper
                    style={{
                      width: "100%",
                      height: "90vh",
                      backgroundColor: "#c9c9c9",
                    }}
                    elevation={2}
                  ></Paper>
                )}
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <TextField
                  id="question"
                  inputRef={questionInputRef}
                  fullWidth
                  variant="outlined"
                  label="Sua pergunta..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <TextField
                  id="response"
                  disabled={question.length === 0}
                  fullWidth
                  variant="outlined"
                  label="Sua resposta..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={5}>
                <Button
                  disabled={question.length === 0 || response.length === 0}
                  variant="contained"
                  fullWidth
                  onClick={addQuestionAnwser}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} lg={8}>
          <Paper elevation={2}>
            <Grid container spacing={2} pl={3} pr={3}>
              <Grid item xs={12}>
                <Typography variant="h4">Perguntas Feitas</Typography>
              </Grid>
              <Grid item xs={12}>
                <QuestionList
                  questions={questions}
                  deleteQuestionAnwser={deleteQuestionAnwser}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} lg={5} alignItems="center">
          <Button
            disabled={questions.length < 1}
            variant="contained"
            fullWidth
            onClick={saveAnnotations}
          >
            Concluir Anotação
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
