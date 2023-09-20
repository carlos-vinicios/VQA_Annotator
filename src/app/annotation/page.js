'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Grid, TextField, Box, Typography, Paper } from '@mui/material';
import QuestionList from '@/components/questionsList';
import apiServices from '@/services/apiServices';
import FinishModal from '@/components/finishModal';
import { redirect } from 'next/navigation';

export default function Annotation() {
  const { data: session, status } = useSession();
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([]);

  const [finishAnnotation, setFinishAnnotation] = useState(false);
  const [reportFile, setReportFile] = useState({});

  //apenas para o experimento de tempo
  const [fileTime, setFileTime] = useState({});
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if(status === 'unauthenticated'){
      redirect("/login")
    }
  }, [status])

  useEffect(() => {
    if(Object.keys(reportFile).length === 0){
      apiServices.getNextFile().then(data => {
        if(data.file.length > 0){
          setReportFile(data);
          setFileTime({filename: data.file, start: new Date(), end: null});
        }else{
          setFinishAnnotation(true);
          apiServices.annotationTime(times).then(data => {
            console.log(data)
          });
        }
      })
    }
  }, [reportFile])

  const addQuestionAnwser = () => {
    if(question.length > 0 && answer.length > 0) {
      if(questions.filter((qa, _) => qa.question === question).length > 0) {
        alert('Essa pergunta já foi adicionada')
        return
      }
      
      setQuestions(prev => [...prev, {
        question,
        answer,
      }])
      setQuestion('');
      setAnswer('');
    }
  }

  const deleteQuestionAnwser = (index) => {
    setQuestions(
      questions.filter((_, i) => i !== index)
    )
  }

  const saveAnnotations = () => {
    if(questions.length > 0) {
      const dataObj = {
        user_id: '12345', //para teste deixa um default
        doc_id: reportFile.file,
        questions,
      }
      apiServices.saveAnnotations(dataObj).then(() => {
        alert('Anotaçães salvas com sucesso')
      })
    }
    var fullTime = {...fileTime, end: new Date()}
    setTimes(prev => [...prev, fullTime]);

    //resetando o estado
    setFileTime({})
    setQuestion('');
    setAnswer('');
    setReportFile({});
    setQuestions([]);
  }

  return (
    <Box
      pl={3} pr={3}
      mt={3} mb={3}
    >
      <FinishModal open={finishAnnotation} />
      <Grid 
        container 
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sm={12} lg={8}>
          <Paper elevation={2} sx={{paddingBottom: 3}}>
            <Grid 
              container spacing={2} 
              pl={3} pr={3} 
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} lg={12}>
                {(Object.keys(reportFile).length > 0) && (
                  <embed
                    style={{
                      width: '100%',
                      height: '90vh',
                    }}
                    src={`http://192.168.0.40:3000/api/reports/${reportFile.file}`}
                    //src="https://docs.google.com/viewerng/viewer?embedded=true&url=http://www.inf.puc-rio.br/wordpress/wp-content/uploads/2022/12/Regulamento-PG-DI-2022-12-06.pdf"
                  />
                )}
                {(Object.keys(reportFile).length === 0) && (
                  <Paper
                    style={{
                      width: '100%',
                      height: '90vh',
                      backgroundColor: '#c9c9c9',
                    }}
                    elevation={2}
                  >
                  </Paper>
                )}
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <TextField 
                  id="question"
                  fullWidth
                  variant="outlined"
                  label="Sua pergunta..."
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <TextField 
                  id="answer" 
                  multiline fullWidth 
                  variant="outlined"
                  label="Sua resposta..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)} 
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={5}>
                <Button
                  disabled={question.length === 0 || answer.length === 0}
                  variant="contained" fullWidth
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
            variant="contained" fullWidth
            onClick={saveAnnotations}
          >
            Concluir Anotação
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}