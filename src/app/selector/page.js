'use client'

import { useState, useEffect } from 'react';
import { Grid, Box, Paper } from '@mui/material';
import apiServices from '@/services/apiServices';
import PdfViewer from '@/components/pdfViewer';

export default function Selector() {
  const [reportFile, setReportFile] = useState({});
  const [pagesMetadata, setPagesMetadata] = useState([]);
  const [finishSelection, setFinishSelection] = useState(false);

  useEffect(() => {
    if(Object.keys(reportFile).length === 0){
      apiServices.getNextFile().then(data => {
        if(data.file.length > 0){
          setReportFile(data);
        }else{
          setFinishSelection(true);
        }
      })
    }
  }, [reportFile])

  const pageChanged = (pageNumber, pageMetadata) => {
    if(pageNumber < pagesMetadata.length){
      pagesMetadata[pageNumber-1] = pageMetadata;
      setPagesMetadata(pagesMetadata);
    }else{
      setPagesMetadata(prev => [...prev, pageMetadata]);
    }
  }

  return (
    <Box
      pl={3} pr={3}
      mt={3} mb={3}
    >
      <Grid
        container 
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sm={12} lg={6}>
          <Paper elevation={2} sx={{paddingBottom: 3}}>
            <Grid 
              container spacing={2} 
              pl={3} pr={3} 
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} lg={8}>
                {(Object.keys(reportFile).length > 0) && (
                  <PdfViewer 
                    filePath={`http://192.168.0.40:3000/api/reports/${reportFile.file}`}
                    onChangePage={pageChanged}
                    pagesMetadata={pagesMetadata}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}