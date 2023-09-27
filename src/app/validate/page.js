'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Grid, TextField, Box, Paper } from '@mui/material';
import validateServices from '@/services/api/validateServices';
import FinishModal from '@/components/finishModal';
import { redirect } from 'next/navigation';

export default function Validate() {
  const { data: session, status } = useSession();

  
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  
  const [finishValidation, setFinishValidation] = useState(false);
  const [dbQuestionData, setDbQuestionData] = useState({});

  //calculo de tempo
  const [startTime, setStartTime] = useState();

  useEffect(() => {
    //caso não esteja logado, volta para autenticação
    if(status === 'unauthenticated'){
      redirect("/login")
    }
  }, [status])

  useEffect(() => {
    if(Object.keys(dbQuestionData).length === 0){
      validateServices.getNextQuestion().then(questionData => {
        if(typeof(questionData) === 'string'){
          setFinishValidation(true);
          return
        }
        if(questionData){
          setDbQuestionData(questionData);
        }
      })
    }else{
      setQuestion(dbQuestionData.question);
      setStartTime(new Date());
    }
  }, [dbQuestionData])

  const saveResponse = () => {
    if(question.length > 0) {
      let validationElapsedTime = new Date() - startTime 
      const dataObj = {
        validator: session.user.email,
        questionId: dbQuestionData.id,
        response: response,
        validationElapsedTime
      }
      
      validateServices.saveResponse(dataObj).then(() => {
        alert('Resposta salva com sucesso')
        //resetando o estado
        setDbQuestionData({});
        setQuestion('');
        setResponse('');
        setStartTime(null);
      })
    }
  }

  return (
    <Box
      pl={3} pr={3}
      mt={3} mb={3}
    >
      <FinishModal open={finishValidation} />
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
                {(Object.keys(dbQuestionData).length > 0) && (
                  <embed
                    style={{
                      width: '100%',
                      height: '90vh',
                    }}
                    src={`http://192.168.0.40:3000/api/page/${dbQuestionData.pageFilename}`}
                    //src="https://docs.google.com/viewerng/viewer?embedded=true&url=http://www.inf.puc-rio.br/wordpress/wp-content/uploads/2022/12/Regulamento-PG-DI-2022-12-06.pdf"
                  />
                )}
                {(Object.keys(dbQuestionData).length === 0) && (
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
                  disabled={true}
                  variant="outlined"
                  label="Pergunta"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <TextField 
                  id="response" 
                  multiline fullWidth 
                  variant="outlined"
                  label="Sua resposta..."
                  value={response}
                  onChange={e => setResponse(e.target.value)} 
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={5}>
                <Button
                  disabled={question.length === 0 || response.length === 0}
                  variant="contained" fullWidth
                  onClick={saveResponse}
                >
                  Confirmar Resposta
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}