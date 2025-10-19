import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Alert,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tag,
  Link,
} from '@chakra-ui/react';
import { api } from '../api/client';

function FeatureRequests() {
  const [calls, setCalls] = useState([]);
  const [features, setFeatures] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCalls();
      setCalls(data.calls || []);

      // Extract all feature requests from all calls
      const allFeatures = [];
      (data.calls || []).forEach(call => {
        if (call.insights?.featureRequests) {
          call.insights.featureRequests.forEach(feature => {
            allFeatures.push({
              ...feature,
              callId: call.callId,
              callDate: call.callDate,
              participantName: call.participantName,
              company: call.company,
            });
          });
        }
      });

      setFeatures(allFeatures);

      // Detect patterns
      const detectedPatterns = detectPatterns(allFeatures);
      setPatterns(detectedPatterns);

    } catch (err) {
      console.error('Error loading features:', err);
      setError(err.response?.data?.error || 'Failed to load feature requests');
    } finally {
      setIsLoading(false);
    }
  };

  const detectPatterns = (featuresList) => {
    // Group features by similarity in text
    const patterns = new Map();

    featuresList.forEach(feature => {
      const text = feature.text.toLowerCase();

      // Extract key phrases (3+ consecutive words) for pattern matching
      const words = text.split(/\s+/);
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ');

        // Skip common/generic phrases
        if (!phrase.match(/\b(the|and|for|with|that|this|from|have|been)\b/)) {
          if (!patterns.has(phrase)) {
            patterns.set(phrase, []);
          }
          patterns.get(phrase).push(feature);
        }
      }
    });

    // Find patterns that appear in multiple features
    const patternList = Array.from(patterns.entries())
      .filter(([_, items]) => items.length >= 2)
      .map(([phrase, items]) => {
        // Get unique features (same feature might match multiple phrases)
        const uniqueFeatures = Array.from(
          new Map(items.map(f => [f.text, f])).values()
        );

        return {
          phrase,
          count: uniqueFeatures.length,
          features: uniqueFeatures,
          priority: calculateAveragePriority(uniqueFeatures),
          // Create a summary from the first feature
          summary: uniqueFeatures[0].text,
          // Get representative example
          example: uniqueFeatures[0].quote || uniqueFeatures[0].text.substring(0, 150)
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return patternList;
  };

  const calculateAveragePriority = (items) => {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    const avg = items.reduce((sum, i) => sum + (priorityMap[i.priority] || 0), 0) / items.length;
    if (avg >= 2.5) return 'high';
    if (avg >= 1.5) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'green';
      case 'medium': return 'blue';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading feature requests...</Text>
      </Box>
    );
  }

  if (error) {
    return <Alert status="error">{error}</Alert>;
  }

  return (
    <Box>
      <Heading mb={6}>Feature Requests</Heading>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Requests</StatLabel>
              <StatNumber>{features.length}</StatNumber>
              <StatHelpText>Across {calls.length} calls</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>High Priority</StatLabel>
              <StatNumber color="green.500">
                {features.filter(f => f.priority === 'high').length}
              </StatNumber>
              <StatHelpText>Most requested features</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Patterns Detected</StatLabel>
              <StatNumber color="blue.500">{patterns.length}</StatNumber>
              <StatHelpText>Common feature themes</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Patterns Section */}
      {patterns.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">Common Feature Patterns</Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Recurring feature requests across calls
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {patterns.map((pattern, index) => (
                <Box
                  key={index}
                  p={5}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  bg="white"
                  _hover={{ shadow: 'md', borderColor: 'blue.300' }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme={getPriorityColor(pattern.priority)} fontSize="md" px={3} py={1}>
                      {pattern.priority} priority
                    </Badge>
                    <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                      {pattern.count} requests
                    </Badge>
                  </HStack>

                  <Text fontWeight="bold" fontSize="md" mb={2} color="gray.800">
                    {pattern.summary}
                  </Text>

                  {pattern.example && (
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      fontStyle="italic"
                      borderLeft="3px solid"
                      borderColor="green.400"
                      pl={3}
                      py={1}
                    >
                      "{pattern.example}"
                    </Text>
                  )}

                  <Accordion allowToggle mt={3}>
                    <AccordionItem border="none">
                      <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                        <Text fontSize="sm" color="blue.600" fontWeight="medium">
                          View all {pattern.count} related feature requests
                        </Text>
                        <AccordionIcon ml={2} />
                      </AccordionButton>
                      <AccordionPanel px={0} pb={0}>
                        <VStack spacing={2} align="stretch" mt={2}>
                          {pattern.features.map((feature, idx) => (
                            <Box
                              key={idx}
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                              fontSize="sm"
                            >
                              <HStack justify="space-between" mb={1}>
                                <Text fontWeight="medium" color="gray.700">
                                  {feature.participantName} {feature.company && `(${feature.company})`}
                                </Text>
                                <Link
                                  as={RouterLink}
                                  to={`/calls/${feature.callId}`}
                                  color="blue.500"
                                  fontSize="xs"
                                >
                                  View Call
                                </Link>
                              </HStack>
                              <Text color="gray.600">{feature.text}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* All Features */}
      <Card>
        <CardHeader>
          <Heading size="md">All Feature Requests</Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Complete list organized by call
          </Text>
        </CardHeader>
        <CardBody>
          {features.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No feature requests found. Start analyzing calls to see insights.
            </Text>
          ) : (
            <Accordion allowMultiple>
              {calls.map((call) => {
                const callFeatures = features.filter(f => f.callId === call.callId);
                if (callFeatures.length === 0) return null;

                return (
                  <AccordionItem key={call.callId}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <HStack justify="space-between" w="full">
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Text fontWeight="bold">
                                {call.participantName || 'Unknown'}
                              </Text>
                              {call.company && (
                                <Badge colorScheme="purple">{call.company}</Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              {new Date(call.callDate).toLocaleDateString()}
                            </Text>
                          </VStack>
                          <Badge colorScheme="blue">{callFeatures.length} requests</Badge>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <VStack spacing={4} align="stretch">
                        {callFeatures.map((feature, idx) => (
                          <Box
                            key={idx}
                            p={4}
                            bg="blue.50"
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderColor={`${getPriorityColor(feature.priority)}.500`}
                          >
                            <HStack justify="space-between" mb={2}>
                              <Badge colorScheme={getPriorityColor(feature.priority)}>
                                {feature.priority} priority
                              </Badge>
                              {feature.confidence && (
                                <Text fontSize="xs" color="gray.600">
                                  Confidence: {Math.round(feature.confidence * 100)}%
                                </Text>
                              )}
                            </HStack>
                            <Text fontWeight="medium" mb={2}>
                              {feature.text}
                            </Text>
                            {feature.quote && (
                              <Text
                                fontSize="sm"
                                color="gray.700"
                                fontStyle="italic"
                                borderLeft="3px solid"
                                borderColor="gray.400"
                                pl={3}
                              >
                                "{feature.quote}"
                              </Text>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}

export default FeatureRequests;
