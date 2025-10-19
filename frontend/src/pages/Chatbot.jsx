import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardBody,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Badge,
  Flex,
  Spinner,
  Link,
} from '@chakra-ui/react';
import { api } from '../api/client';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isQueryInProgress, setIsQueryInProgress] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQueries = [
    "What are the most common pain points mentioned?",
    "Which features are most frequently requested?",
    "What objections do customers have?",
    "Summarize feedback from enterprise customers",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e, query = null) => {
    if (e) e.preventDefault();

    const queryText = query || currentQuery;
    if (!queryText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentQuery('');
    setIsQueryInProgress(true);

    try {
      const response = await api.queryChatbot(queryText);

      // Add assistant message
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error querying chatbot:', error);

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsQueryInProgress(false);
    }
  };

  const handleSuggestedQuery = (query) => {
    handleSubmit(null, query);
  };

  return (
    <Box>
      <Heading mb={6}>Ask Questions About Your Calls</Heading>

      <Card minH="600px" maxH="calc(100vh - 200px)" display="flex" flexDirection="column">
        <CardBody display="flex" flexDirection="column" p={0} overflow="hidden">
          {/* Messages Area */}
          <Box flex="1" overflowY="auto" p={6} pb={4}>
            {messages.length === 0 ? (
              <VStack spacing={4} py={10}>
                <Heading size="md" color="gray.600">
                  Start by asking a question
                </Heading>
                <Text color="gray.500" textAlign="center">
                  Try one of these suggested queries:
                </Text>
                <VStack spacing={2} w="100%" maxW="600px">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      colorScheme="blue"
                      w="100%"
                      onClick={() => handleSuggestedQuery(query)}
                      isDisabled={isQueryInProgress}
                    >
                      {query}
                    </Button>
                  ))}
                </VStack>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch" pb={4}>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isQueryInProgress && (
                  <HStack spacing={2} color="gray.500">
                    <Spinner size="sm" />
                    <Text fontSize="sm">Thinking...</Text>
                  </HStack>
                )}
                <div ref={messagesEndRef} />
              </VStack>
            )}
          </Box>

          {/* Input Area */}
          <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="white" flexShrink={0}>
            <form onSubmit={handleSubmit}>
              <HStack>
                <Input
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder="Ask a question about your calls..."
                  disabled={isQueryInProgress}
                  size="lg"
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={isQueryInProgress}
                  disabled={!currentQuery.trim()}
                >
                  Send
                </Button>
              </HStack>
            </form>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <Flex justify={isUser ? 'flex-end' : 'flex-start'}>
      <Box
        maxW="80%"
        bg={isUser ? 'blue.500' : 'gray.100'}
        color={isUser ? 'white' : 'black'}
        px={4}
        py={3}
        borderRadius="lg"
      >
        <Text whiteSpace="pre-wrap">{message.content}</Text>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.300">
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Sources:
            </Text>
            <VStack align="stretch" spacing={2}>
              {message.sources.map((source, index) => (
                <Link
                  key={index}
                  as={RouterLink}
                  to={`/calls/${source.callId}`}
                  fontSize="sm"
                  color="blue.600"
                  _hover={{ textDecoration: 'underline' }}
                >
                  <HStack>
                    <Badge colorScheme="blue">{index + 1}</Badge>
                    <Text>
                      Call with {source.participantName} ({source.company}) -{' '}
                      {new Date(source.callDate).toLocaleDateString()}
                    </Text>
                  </HStack>
                </Link>
              ))}
            </VStack>
          </Box>
        )}

        <Text fontSize="xs" color={isUser ? 'whiteAlpha.700' : 'gray.500'} mt={2}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </Box>
    </Flex>
  );
}

export default Chatbot;
