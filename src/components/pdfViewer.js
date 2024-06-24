//ativando o módulo de visualização de PDFs
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import { useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import { Box } from "@mui/material";
import { MapInteractionCSS } from "react-map-interaction";

export default function PdfViewer({
  filePath,
  pageNumber,
  pageWidth,
  QAS,
  matchers,
  mobilePositionControl
}) {
  const { mobileMatches, tabletMatches, computerMatches } = matchers;
  const [boxesElements, setBoxesElements] = useState([]);
  const BoxRef = useRef(null);
  const {documentPosition, setDocumentPosition } = mobilePositionControl;

  function pdfViewSize() {
    if (mobileMatches && !tabletMatches && !computerMatches) return 350;
    return pageWidth;
  }

  function createQABoxes(boxes, pageBox) {
    if (BoxRef.current) {
      setBoxesElements(
        boxes.map((element, index) => {
          let w = pageBox.width * element[2];
          let h = pageBox.height * element[3];
          let x = pageBox.width * element[0] + BoxRef.current.offsetLeft;
          let y = pageBox.height * element[1] + BoxRef.current.offsetTop;
          return (
            <Box
              id={`BB_${index}`}
              key={index}
              sx={{
                position: "absolute",
                top: y,
                left: x,
                backgroundColor: element.color,
                width: w,
                height: h,
                zIndex: 8,
              }}
            />
          );
        })
      );
    }
  }

  function onPageLoadSuccess(props) {
    var boxes = [];
    QAS.forEach((element) => {
      element.answer_bboxes.forEach((box) => {
        box.color = element.color;
        boxes.push(box);
      });
    });
    createQABoxes(boxes, props);
  }

  function boxContainer() {
    return (
      <Box ref={BoxRef}>
        <Document file={filePath}>
          <Page
            width={pageWidth}
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadSuccess={onPageLoadSuccess}
          />
        </Document>
        {boxesElements}
      </Box>
    );
  }

  function pdfViewMode() {
    if (mobileMatches && !tabletMatches && !computerMatches) {
      return (
        <MapInteractionCSS
          value={documentPosition}
          onChange={(value) => setDocumentPosition(value)}
        >
          {boxContainer()}
        </MapInteractionCSS>
      );
    }

    return boxContainer();
  }

  return <Box sx={{ maxWidth: pdfViewSize(), width: pageWidth, marginBottom: '50vh' }}>{pdfViewMode()}</Box>;
}
