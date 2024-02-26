//ativando o módulo de visualização de PDFs
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import { useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import { Box } from "@mui/material";

export default function PdfViewer({ filePath, pageNumber, boundingBoxes }) {
  const [boxesElements, setBoxesElements] = useState(null);
  const BoxRef = useRef(null);

  function pdfViewSize() {
    return BoxRef.current ? BoxRef.current.offsetWidth : 0;
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
                opacity: 0.2,
                width: w,
                height: h,
                zIndex: 9999,
              }}
            />
          );
        })
      );
  }

  function onPageLoadSuccess(props) {
    createQABoxes(boundingBoxes, props);
  }

  return (
    <div tabIndex={0} style={{ outline: "none" }}>
      <Box ref={BoxRef}>
        <Document file={filePath}>
          <Page
            width={pdfViewSize()}
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadSuccess={onPageLoadSuccess}
          />
        </Document>
        {boxesElements}
      </Box>
    </div>
  );
}
