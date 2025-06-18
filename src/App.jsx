import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box } from "@mui/material";

function App() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <Navbar />
      <Box component="main" flexGrow={1}>
        <AppRouter />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
