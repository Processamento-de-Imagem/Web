import { Button, Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Hello Material UI
      </Typography>

      <Button variant="contained" color="primary">
        Botão Primário
      </Button>

      <Button variant="outlined" color="secondary" style={{ marginLeft: 10 }}>
        Botão Secundário
      </Button>
    </Container>
  );
}

export default App;