//ativando o módulo de visualização de PDFs
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Box } from "@mui/material";
import { MapInteractionCSS } from "react-map-interaction";

export default function PdfViewer({
  filePath,
  pageNumber,
  pageWidth,
  QAS,
  matchers,
  focusQA,
}) {
  const { mobileMatches, tabletMatches, computerMatches } = matchers;
  const [boxesElements, setBoxesElements] = useState([]);
  const [boxesCoords, setBoxesCoords] = useState([]);
  const [documentPosition, setDocumentPosition] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });
  const BoxRef = useRef(null);

  useEffect(() => {
    if (boxesCoords.length > 0 && focusQA < boxesCoords.length) {
      let coord = boxesCoords[focusQA];
      let zoomScale = 1.3;
      let yScaleFactor = 0;
      let xScaleFactor = 0;
      if (mobileMatches && !tabletMatches && !computerMatches) {
        zoomScale = 0.6;
        yScaleFactor = (500 * coord.y) / 746;
        xScaleFactor = 80;
      }
      setDocumentPosition({
        scale: zoomScale,
        translation: { x: -coord.x + xScaleFactor, y: -coord.y + yScaleFactor },
      });
    }
  }, [focusQA]);

  function pdfViewSize() {
    if (mobileMatches && !tabletMatches && !computerMatches) return 350;
    return pageWidth;
  }

  function createQABoxes(boxes, pageBox) {
    if (BoxRef.current) {
      var localBoxesCoords = [];
      setBoxesElements(
        boxes.map((element, index) => {
          console.log(element)
          // let w = pageBox.width * element.w;
          // let h = pageBox.height * element.h;
          // let x = pageBox.width * element.x + BoxRef.current.offsetLeft;
          // let y = pageBox.height * element.y + BoxRef.current.offsetTop;
          let {x, y, w, h, color} = element
          localBoxesCoords = [...localBoxesCoords, { x, y, w, h }];
          return (
            <Box
              id={`BB_${index}`}
              key={index}
              sx={{
                position: "absolute",
                top: y,
                left: x,
                backgroundColor: color,
                width: w,
                height: h,
                zIndex: 8,
              }}
            />
          );
        })
      );
      setBoxesCoords(localBoxesCoords);
    }
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
    <Box sx={{ maxWidth: pdfViewSize() }}>
      <MapInteractionCSS
        value={documentPosition}
        onChange={(value) => setDocumentPosition(value)}
      >
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
      </MapInteractionCSS>
    </Box>
  );
}
