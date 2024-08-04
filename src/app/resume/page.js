"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Button,
  TablePagination,
} from "@mui/material";
import evaluationService from "@/services/api/evaluationService";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import SideMenu from "@/components/sideMenu";

export default function FileTable() {
  const router = useRouter();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.up("xs"));
  const tabletMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const computerMatches = useMediaQuery(theme.breakpoints.up("lg"));

  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    evaluationService
      .listFilesToEvaluation()
      .then((response) => {
        setFiles(response);
      })
      .catch((error) => {
        console.error("Erro ao listar arquivos:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  const startEvaluation = () => {
    router.push("/document/evaluation");
  }

  const previewDocument = (evalId) => {
    router.push(`/document/${evalId}`);
    // Lógica para pré-visualizar o documento
  };

  const editEvaluation = (evalId) => {
    router.push(`/document/ed_${evalId}`);
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFiles = filteredFiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box pl={3} pr={3} mt={3} mb={3}>
      <SideMenu matchers={{ mobileMatches, tabletMatches, computerMatches }} />
      <Container sx={{ mt: 8 }}>
        <TextField
          label="Buscar arquivos"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Arquivos</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFiles.map((file) => (
                <TableRow key={file.file_id}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => previewDocument(file.file_id)}
                    >
                      <PreviewIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => editEvaluation(file.file_id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredFiles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box display="flex" flexDirection="row-reverse">
          <Button sx={{ mt: 4 }} variant="contained" align="right" onClick={startEvaluation}>
            Validar Arquivos
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
