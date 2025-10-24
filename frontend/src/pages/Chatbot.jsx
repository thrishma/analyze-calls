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
import { useDemoMode } from '../hooks/useDemoMode';
import { DEMO_CALLS } from '../data/demoData';

/**
 * Simulate chatbot response using demo data
 * This function searches through demo calls and generates contextual responses
 */
async function simulateDemoResponse(query) {
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const lowerQuery = query.toLowerCase();

  // Collect relevant information from demo calls
  let painPoints = [];
  let featureRequests = [];
  let objections = [];
  let relevantCalls = [];

  // Search through all demo calls for relevant information
  DEMO_CALLS.forEach(call => {
    let isRelevant = false;

    // Check pain points
    if (lowerQuery.includes('pain') || lowerQuery.includes('problem') || lowerQuery.includes('challenge') || lowerQuery.includes('issue')) {
      call.analysis.painPoints.forEach(pp => {
        if (matchesQuery(lowerQuery, pp.description) || matchesCategory(lowerQuery, pp.category)) {
          painPoints.push({ ...pp, call });
          isRelevant = true;
        }
      });
    }

    // Check feature requests
    if (lowerQuery.includes('feature') || lowerQuery.includes('request') || lowerQuery.includes('want') || lowerQuery.includes('need')) {
      call.analysis.featureRequests.forEach(fr => {
        if (matchesQuery(lowerQuery, fr.feature) || matchesCategory(lowerQuery, fr.category)) {
          featureRequests.push({ ...fr, call });
          isRelevant = true;
        }
      });
    }

    // Check objections
    if (lowerQuery.includes('objection') || lowerQuery.includes('concern') || lowerQuery.includes('worry') || lowerQuery.includes('risk')) {
      call.analysis.objections.forEach(obj => {
        if (matchesQuery(lowerQuery, obj.concern) || matchesCategory(lowerQuery, obj.category)) {
          objections.push({ ...obj, call });
          isRelevant = true;
        }
      });
    }

    // Keyword-based relevance for general queries
    const callText = `${call.summary} ${call.transcript || ''}`.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 3);
    let matchScore = 0;
    queryWords.forEach(word => {
      if (callText.includes(word)) {
        matchScore++;
        isRelevant = true;
      }
    });

    if (isRelevant) {
      relevantCalls.push({ call, matchScore });
    }
  });

  // Generate answer based on what was found
  let answer = '';
  const sources = [];

  if (painPoints.length > 0) {
    answer += generatePainPointsAnswer(painPoints, lowerQuery);
    painPoints.slice(0, 5).forEach(pp => addSource(sources, pp.call));
  }

  if (featureRequests.length > 0) {
    if (answer) answer += '\n\n';
    answer += generateFeatureRequestsAnswer(featureRequests, lowerQuery);
    featureRequests.slice(0, 5).forEach(fr => addSource(sources, fr.call));
  }

  if (objections.length > 0) {
    if (answer) answer += '\n\n';
    answer += generateObjectionsAnswer(objections, lowerQuery);
    objections.slice(0, 5).forEach(obj => addSource(sources, obj.call));
  }

  // If no specific matches, provide a general summary
  if (!answer && relevantCalls.length > 0) {
    relevantCalls.sort((a, b) => b.matchScore - a.matchScore);
    const topCalls = relevantCalls.slice(0, 3);
    answer = `Based on the customer calls, here's what I found:\n\n`;
    topCalls.forEach((rc, i) => {
      answer += `**${i + 1}. ${rc.call.metadata.participantName} (${rc.call.metadata.company})**\n${rc.call.summary}\n\n`;
      addSource(sources, rc.call);
    });
  }

  // Fallback if nothing relevant found
  if (!answer) {
    answer = "I couldn't find specific information related to your question in the demo calls. Try asking about pain points, feature requests, objections, or specific topics like checkout, inventory, mobile, or international sales.";
  }

  return {
    answer,
    sources: sources.slice(0, 5) // Limit to top 5 sources
  };
}

function matchesQuery(query, text) {
  const queryWords = query.split(/\s+/).filter(w => w.length > 3);
  const lowerText = text.toLowerCase();
  return queryWords.some(word => lowerText.includes(word));
}

function matchesCategory(query, category) {
  return query.includes(category.toLowerCase());
}

function addSource(sources, call) {
  // Avoid duplicate sources
  if (!sources.find(s => s.callId === call.callId)) {
    sources.push({
      callId: call.callId,
      participantName: call.metadata.participantName,
      company: call.metadata.company,
      callDate: call.metadata.callDate
    });
  }
}

function generatePainPointsAnswer(painPoints, query) {
  const highSeverity = painPoints.filter(pp => pp.severity === 'high');
  const sortedPainPoints = [...highSeverity, ...painPoints.filter(pp => pp.severity !== 'high')].slice(0, 5);

  let answer = `**Pain Points & Challenges:**\n\n`;
  sortedPainPoints.forEach((pp, i) => {
    answer += `${i + 1}. **${pp.description}** (${pp.severity} severity)\n`;
    if (pp.quote) {
      answer += `   "${pp.quote}" - ${pp.call.metadata.participantName}, ${pp.call.metadata.company}\n\n`;
    }
  });

  return answer;
}

function generateFeatureRequestsAnswer(featureRequests, query) {
  const highPriority = featureRequests.filter(fr => fr.priority === 'high');
  const sortedFeatures = [...highPriority, ...featureRequests.filter(fr => fr.priority !== 'high')].slice(0, 5);

  let answer = `**Feature Requests:**\n\n`;
  sortedFeatures.forEach((fr, i) => {
    answer += `${i + 1}. **${fr.feature}** (${fr.priority} priority)\n`;
    if (fr.quote) {
      answer += `   "${fr.quote}" - ${fr.call.metadata.participantName}, ${fr.call.metadata.company}\n\n`;
    }
  });

  return answer;
}

function generateObjectionsAnswer(objections, query) {
  const highSeverity = objections.filter(obj => obj.severity === 'high');
  const sortedObjections = [...highSeverity, ...objections.filter(obj => obj.severity !== 'high')].slice(0, 5);

  let answer = `**Objections & Concerns:**\n\n`;
  sortedObjections.forEach((obj, i) => {
    answer += `${i + 1}. **${obj.concern}** (${obj.severity} severity)\n`;
    if (obj.quote) {
      answer += `   "${obj.quote}" - ${obj.call.metadata.participantName}, ${obj.call.metadata.company}\n\n`;
    }
  });

  return answer;
}

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isQueryInProgress, setIsQueryInProgress] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDemoMode, demoChatHistory } = useDemoMode();

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

  // Load demo chat history in demo mode
  useEffect(() => {
    if (isDemoMode && demoChatHistory.length > 0 && messages.length === 0) {
      const demoMessages = demoChatHistory.flatMap(chat => [
        {
          id: `${chat.id}-user`,
          role: 'user',
          content: chat.query,
          timestamp: chat.timestamp,
        },
        {
          id: `${chat.id}-assistant`,
          role: 'assistant',
          content: chat.answer,
          sources: chat.sources || [],
          timestamp: chat.timestamp,
        }
      ]);
      setMessages(demoMessages);
    }
  }, [isDemoMode, demoChatHistory]);

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
      let response;

      // In demo mode, simulate chatbot responses using demo data
      if (isDemoMode) {
        response = await simulateDemoResponse(queryText);
      } else {
        response = await api.queryChatbot(queryText);
      }

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
