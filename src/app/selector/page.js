"use client";

import { useState, useEffect } from "react";
import { Grid, Box, Paper } from "@mui/material";
import selectorServices from "@/services/api/selectorServices";
import PdfViewer from "@/components/pdfViewer";
import FinishModal from "@/components/finishModal";

export default function Selector() {
  const [reportFile, setReportFile] = useState({});
  const [metadatas, setMetadatas] = useState([]);
  const [finishSelection, setFinishSelection] = useState(false);

  useEffect(() => {
    if (Object.keys(reportFile).length === 0) {
      selectorServices.getNextReport().then((data) => {
        if (typeof data === "string") {
          alert(data);
          setFinishSelection(true);
          return;
        }
        if (Object.keys(data).length > 0) {
          setReportFile(data);
        }
      });
    }
  }, [reportFile]);

  const pageChanged = (pageNumber, pageMetadata) => {
    if (pageNumber < metadatas.length) {
      metadatas[pageNumber - 1] = pageMetadata;
      setMetadatas(metadatas);
    } else {
      setMetadatas((prev) => [...prev, pageMetadata]);
    }
  };

  const sendPageMetadata = () => {
    selectorServices
      .savePageMetadatas({
        file_id: reportFile.id,
        metadatas,
      })
      .then((data) => {
        alert(data);
        setReportFile({});
        setMetadatas([]);
      });
  };

  return (
    <Box pl={3} pr={3} mt={3} mb={3}>
      <FinishModal open={finishSelection} />
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item sm={12} lg={6}>
          <Paper elevation={2} sx={{ paddingBottom: 3 }}>
            <Grid
              container
              spacing={2}
              pl={3}
              pr={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} lg={8}>
                {Object.keys(reportFile).length > 0 && (
                  <PdfViewer
                    filePath={`http://192.168.0.40:3000/api/report/${reportFile.ticker}/${reportFile.filename}`}
                    onChangePage={pageChanged}
                    pagesMetadata={metadatas}
                    sendMetadata={sendPageMetadata}
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
