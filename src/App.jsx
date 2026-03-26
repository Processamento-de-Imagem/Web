import { MainProvider } from "./hooks/main-provider";
import Container from "./components/container";
import Body from "./components/body/body";

function App() {
  return (
    <MainProvider>
      <Container>
        <Body />  
      </Container>
    </MainProvider>
  );
}

export default App;