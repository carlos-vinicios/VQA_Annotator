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

export default function PdfViewer({ filePath, pageNumber, QAS, matchers }) {
  const { mobileMatches, tabletMatches, computerMatches } = matchers;
  const [boxesElements, setBoxesElements] = useState([]);
  const BoxRef = useRef(null);

  function pdfViewSize() {
    if (mobileMatches && !tabletMatches && !computerMatches) return 350;
    return 1550;
  }

  function createQABoxes(boxes, pageBox) {
    if (BoxRef.current)
      setBoxesElements(
        boxes.map((element, index) => {
          let w = pageBox.width * element.w;
          let h = pageBox.height * element.h;
          let x = pageBox.width * element.x + BoxRef.current.offsetLeft;
          let y = pageBox.height * element.y + BoxRef.current.offsetTop;
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

  function onPageLoadSuccess(props) {
    var boxes = [];
    QAS.forEach((element) => {
      element.boxes.forEach((box) => {
        box.color = element.color;
        boxes.push(box);
      });
    });
    createQABoxes(boxes, props);
  }

  return (
    <Box sx={{maxWidth: pdfViewSize()}}>
      <MapInteractionCSS>
        <Box ref={BoxRef}>
          <Document file={filePath}>
            <Page
              width={1550}
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={onPageLoadSuccess}
            />
          </Document>
          {boxesElements}
        </Box>
      </MapInteractionCSS>
    </Box>
  );
}
