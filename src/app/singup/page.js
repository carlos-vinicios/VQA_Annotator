"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  MenuItem,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { v4 as uuidv4 } from "uuid";
import authService from "@/services/api/authService";

export default function RegistrationForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [occupationDescription, setOccupationDescription] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [token] = useState(uuidv4().split("-").slice(-1).pop());

  const [loading, setLoading] = useState(false);

  const educationLevels = [
    "Ensino Fundamental Incompleto",
    "Ensino Fundamental Completo",
    "Ensino Médio Incompleto",
    "Ensino Médio Completo",
    "Ensino Superior Incompleto",
    "Ensino Superior Completo",
    "Pós-graduação",
    "Mestrado",
    "Doutorado",
  ];

  const ageGroups = Array.from({ length: 6 }, (_, i) => 15 + i * 5);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar os dados do formulário
    setConsent(false);
    setLoading(true);
    authService
      .singup({
        name,
        age,
        gender,
        education_level: educationLevel,
        current_occupation: currentOccupation,
        occupation_description: occupationDescription,
        email,
        token,
        consent: true,
      })
      .then((response) => {
        router.push("/login");
        setLoading(false);
        alert(response);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.response.data.detail);
      });
  };

  const liberateRegister = () => {
    return !(
      name !== "" &&
      age !== "" &&
      gender !== "" &&
      educationLevel !== "" &&
      currentOccupation !== "" &&
      occupationDescription !== "" &&
      email !== "" &&
      consent
    );
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Formulário de Cadastro
      </Typography>
      <Typography>
        A pesquisa segue o rigor científico acadêmico e é conduzida anonimamente.
        Não associaremos seu nome e nem seu endereço de e-mail às suas
        respostas. Os dados coletados serão utilizados apenas para
        caracterização dos participantes.
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Atente-se as seguintes informações:
      </Typography>
      <Box component="ul" sx={{ ml: 4 }}>
        <Typography component="li">
          Você irá receber 40 páginas para anotação.
        </Typography>
        <Typography component="li">
          O acesso ao sistema será feito com o e-mail informado e token
          apresentado no formulário. Portanto, salve o seu token de acesso.
        </Typography>
        <Typography component="li">
          O token só é válido após a conclusão do cadastro.
        </Typography>
        <Typography component="li">
          O processo de anotação pode ser interrompido e retomado da onde parou,
          o sistema salva o seu progresso.
        </Typography>
        <Typography component="li">
          O sistema irá selecionar os arquivos para anotação quando o cadastro
          for finalizado. Esse processo pode demorar um pouco.
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nome da Pessoa"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Idade</InputLabel>
          <Select
            label="Idade"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            {ageGroups.map((ageGroup) => (
              <MenuItem key={ageGroup} value={`${ageGroup} - ${ageGroup + 4}`}>
                {ageGroup} - {ageGroup + 4}
              </MenuItem>
            ))}
            <MenuItem key="45+" value="45+">
              45 ou mais
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Sexo</InputLabel>
          <Select
            label="Sexo"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Masculino</MenuItem>
            <MenuItem value="female">Feminino</MenuItem>
            <MenuItem value="other">Outro</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Grau de Escolaridade</InputLabel>
          <Select
            label="Grau de Escolaridade"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
          >
            {educationLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Ocupação Atual"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentOccupation}
          onChange={(e) => setCurrentOccupation(e.target.value)}
        />
        <TextField
          label="Breve Descrição da Ocupação Atual"
          placeholder="Um cientista de dados formado em Ciência da Computação, trabalhando com pesquisa em algo."
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={occupationDescription}
          onChange={(e) => setOccupationDescription(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Token de Acesso"
          variant="outlined"
          fullWidth
          margin="normal"
          value={token}
          InputProps={{
            readOnly: true,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              color="primary"
            />
          }
          label="Declaro meu consentimento para participar da pesquisa."
        />
        <Box display="flex" flexDirection="row-reverse">
          <LoadingButton
            sx={{ mt: 4, mb: 4 }}
            variant="contained"
            type="submit"
            disabled={liberateRegister()}
            loading={loading}
          >
            Cadastrar
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}
