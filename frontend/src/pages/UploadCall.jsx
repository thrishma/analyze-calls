import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Textarea,
  VStack,
  Text,
  useToast,
  Progress,
  Card,
  CardBody,
  Tooltip,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { api } from '../api/client';

function UploadCall() {
  const navigate = useNavigate();
  const toast = useToast();

  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [linkedinExperience, setLinkedinExperience] = useState('');
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [company, setCompany] = useState('');
  // Set default call date to current date/time in local timezone
  const [callDate, setCallDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!participantName || !company || !callDate || !linkedinProfileUrl) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields: Participant Name, Company, Call Date, and LinkedIn Profile URL',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Validate that at least one of transcript or notes is provided
    if (!transcript && !notes) {
      toast({
        title: 'Error',
        description: 'Please provide either a transcript or notes (or both)',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // If transcript is provided, it should be at least 100 characters
    if (transcript && transcript.length < 100) {
      toast({
        title: 'Error',
        description: 'Transcript must be at least 100 characters long',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // If only notes are provided, they should be at least 50 characters
    if (!transcript && notes && notes.length < 50) {
      toast({
        title: 'Error',
        description: 'Notes must be at least 50 characters long',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    try {
      setProcessingStep('Analyzing transcript...');

      const metadata = {
        participantName: participantName || undefined,
        company: company || undefined,
        callDate: callDate || new Date().toISOString(),
        notes: notes || undefined,
      };

      const result = await api.processCall(
        transcript,
        linkedinExperience || null,
        { ...metadata, linkedinProfileUrl: linkedinProfileUrl || undefined }
      );

      setProcessingStep('Analysis complete!');

      toast({
        title: 'Success',
        description: 'Call analyzed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Error processing call:', error);

      let errorMessage = 'Failed to process call';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. The transcript might be too long. Try with a shorter transcript.';
      } else if (error.response?.status === 502 || error.response?.status === 504) {
        errorMessage = 'Gateway timeout. The analysis is taking too long. Please try again with a shorter transcript.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <Box>
      <Heading mb={6}>Upload Customer Discovery Call</Heading>

      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
          {/* Left Column - Transcript */}
          <GridItem>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Call Transcript</FormLabel>
                    <Textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Paste the full call transcript here..."
                      minH="300px"
                      disabled={isProcessing}
                    />
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      {transcript.length} characters (minimum 100 if provided)
                      {transcript.length > 20000 && (
                        <Text as="span" color="orange.500" ml={2}>
                          • Long transcripts may take 1-2 minutes to process
                        </Text>
                      )}
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Additional Notes</FormLabel>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your own observations, context, or key takeaways from the call...&#10;&#10;Examples:&#10;• Important quotes or highlights&#10;• Your interpretations of customer needs&#10;• Action items or follow-ups&#10;• Context not captured in the transcript"
                      minH="150px"
                      disabled={isProcessing}
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      These notes will be searchable via the chatbot and displayed with the call details.
                      {!transcript && !notes && (
                        <Text as="span" color="blue.600" fontWeight="medium">
                          {' '}(Either transcript or notes is required)
                        </Text>
                      )}
                    </Text>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Participant Name</FormLabel>
                    <Input
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={isProcessing}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Company</FormLabel>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      disabled={isProcessing}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Call Date</FormLabel>
                    <Input
                      type="datetime-local"
                      value={callDate}
                      onChange={(e) => setCallDate(e.target.value)}
                      disabled={isProcessing}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Right Column - LinkedIn Information */}
          <GridItem>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <HStack spacing={2} mb={2}>
                      <FormLabel mb={0}>LinkedIn Profile URL</FormLabel>
                      <Tooltip
                        label="Adding LinkedIn data helps the chatbot link insights to participant qualifications. Ask questions like 'Which senior engineers mentioned pain point X?' or 'Show me feedback from founders.'"
                        fontSize="sm"
                        placement="top"
                        hasArrow
                      >
                        <QuestionOutlineIcon color="blue.500" cursor="help" />
                      </Tooltip>
                    </HStack>
                    <Input
                      value={linkedinProfileUrl}
                      onChange={(e) => setLinkedinProfileUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/username"
                      disabled={isProcessing}
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Link to participant's LinkedIn profile
                    </Text>
                  </FormControl>

                  <FormControl>
                    <HStack spacing={2} mb={2}>
                      <FormLabel mb={0}>LinkedIn Experience (Optional)</FormLabel>
                      <Tooltip
                        label="Adding LinkedIn data helps the chatbot link insights to participant qualifications. Ask questions like 'Which senior engineers mentioned pain point X?' or 'Show me feedback from founders.'"
                        fontSize="sm"
                        placement="top"
                        hasArrow
                      >
                        <QuestionOutlineIcon color="blue.500" cursor="help" />
                      </Tooltip>
                    </HStack>
                    <Textarea
                      value={linkedinExperience}
                      onChange={(e) => setLinkedinExperience(e.target.value)}
                      placeholder="Paste the experience section from LinkedIn profile here...&#10;&#10;Example:&#10;Co-Founder & Creative Director&#10;UNDEW INC. · Self-employed&#10;Jan 2025 - Present · 10 mos&#10;Toronto, Ontario, Canada · Remote&#10;Product Development: Overseeing formulation..."
                      minH="400px"
                      disabled={isProcessing}
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Copy and paste the full experience section from their LinkedIn profile
                    </Text>
                  </FormControl>

                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Heading size="sm" mb={2}>
                      What we'll extract:
                    </Heading>
                    <VStack align="start" spacing={1} fontSize="sm">
                      <Text>• Current role and company</Text>
                      <Text>• Past experience history</Text>
                      <Text>• Skills and expertise</Text>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Submit Button */}
        <Box mt={6}>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="100%"
            isLoading={isProcessing}
            loadingText={processingStep}
            _hover={{ bg: 'blue.600', color: 'white' }}
          >
            Analyze Call
          </Button>
          {isProcessing && (
            <Progress size="xs" isIndeterminate mt={2} colorScheme="blue" />
          )}
        </Box>
      </form>
    </Box>
  );
}

export default UploadCall;
