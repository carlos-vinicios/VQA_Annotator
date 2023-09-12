//ativando o módulo de visualização de PDFs
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, FormControlLabel, Checkbox, IconButton, Typography, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';


export default function PdfViewer({ filePath, onChangePage, pagesMetadata, sendMetadata}){
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.up('xs'));
  const tabletMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const computerMatches = useMediaQuery(theme.breakpoints.up('lg'));

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  //estados de controle dos checkbox
  const [text, setText] = useState(true);
  const [image, setImage] = useState(false);
  const [form, setForm] = useState(false);
  const [table, setTable] = useState(false);

  useEffect(() => {
    if(pageNumber < pagesMetadata.length){
      const pageMetadata = pagesMetadata[pageNumber-1];
      setText(pageMetadata.text);
      setImage(pageMetadata.image);
      setForm(pageMetadata.form);
      setTable(pageMetadata.table);
    }
  }, [pageNumber])

  const handleChangeCheckbox = (event, dataType) => {
    if(dataType === 'text'){
      setText(event.target.checked);
    }else if(dataType === 'image'){
      setImage(event.target.checked);
    }else if(dataType === 'form'){
      setForm(event.target.checked);
    }else if(dataType === 'table'){
      setTable(event.target.checked);
    }
  };

  function onDocumentLoadSuccess({ numPages }){
    setNumPages(numPages);
  }

  function changePage(offset) {
    onChangePage(pageNumber, {text, image, form, table});
    setPageNumber(prevPageNumber => prevPageNumber + offset);
    //resetando para o default
    setText(true);
    setImage(false);
    setForm(false);
    setTable(false);
  }

  function previousPage() {
    if(pageNumber === 1)
      return    
    changePage(-1);
  }

  function nextPage() {
    if(pageNumber === numPages)
      return    
    changePage(1);
  }

  function pdfViewSize() {
    if(computerMatches){
      return 550
    }else if(tabletMatches){
      return 680
    }else if(mobileMatches)
      return 320
  }

  return (
    <Box>
      <Box sx={{minHeight: {xs: "65vh", sm: "80vh", lg: "85vh"}}}>
        <Document 
          file={filePath} 
          onLoadSuccess={onDocumentLoadSuccess}
          sx={{width: "100%"}}
          >
          <Page
            width={pdfViewSize()}
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            />
        </Document>
      </Box>
      <Box
        sx={{
          position: 'relative',
          bottom: 50,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: '#FFF',
          textAlign: 'center',
        }}
      >
        <FormControlLabel control={<Checkbox  
          checked={text}
          onChange={(event) => handleChangeCheckbox(event, "text")} />}
          label="Texto"
        />
        <FormControlLabel control={<Checkbox  
          checked={table} 
          onChange={event => handleChangeCheckbox(event, "table")} />}
          label="Tabela"
        />
        <FormControlLabel control={<Checkbox  
          checked={form} 
          onChange={(event) => handleChangeCheckbox(event, "form")} />}
          label="Formulário"
        />
        <FormControlLabel control={<Checkbox  
          checked={image} 
          onChange={(event) => handleChangeCheckbox(event, "image")} />}
          label="Imagem"
        />
        <Box>
          <IconButton aria-label="previous-page" onClick={previousPage}>
            <ArrowBackIos />
          </IconButton>
          <Typography sx={{display: 'inline-block'}}>
            {pageNumber} | {numPages}
          </Typography>
          <IconButton aria-label="next-page" onClick={nextPage}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
        <Box>
          <Button
            sx={{mt: 2, mb: 2, display: (pageNumber === numPages ? 'flex-block' : 'none')}}
            variant="contained"
            onClick={sendMetadata}
          >Concluir</Button>
        </Box>
      </Box>
    </Box>
  )
}