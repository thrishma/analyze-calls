import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import UploadCall from './pages/UploadCall';
import CallDetail from './pages/CallDetail';
import Chatbot from './pages/Chatbot';
import PainPoints from './pages/PainPoints';
import FeatureRequests from './pages/FeatureRequests';
import Objections from './pages/Objections';

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadCall />} />
          <Route path="/calls/:callId" element={<CallDetail />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/pain-points" element={<PainPoints />} />
          <Route path="/feature-requests" element={<FeatureRequests />} />
          <Route path="/objections" element={<Objections />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;
