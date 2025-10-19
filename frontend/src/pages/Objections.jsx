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

function Objections() {
  const [calls, setCalls] = useState([]);
  const [objections, setObjections] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadObjections();
  }, []);

  const loadObjections = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCalls();
      setCalls(data.calls || []);

      // Extract all objections from all calls
      const allObjections = [];
      (data.calls || []).forEach(call => {
        if (call.insights?.objections) {
          call.insights.objections.forEach(objection => {
            allObjections.push({
              ...objection,
              callId: call.callId,
              callDate: call.callDate,
              participantName: call.participantName,
              company: call.company,
            });
          });
        }
      });

      setObjections(allObjections);

      // Detect patterns
      const detectedPatterns = detectPatterns(allObjections);
      setPatterns(detectedPatterns);

    } catch (err) {
      console.error('Error loading objections:', err);
      setError(err.response?.data?.error || 'Failed to load objections');
    } finally {
      setIsLoading(false);
    }
  };

  const detectPatterns = (objectionsList) => {
    // Group objections by similarity in text
    const patterns = new Map();

    objectionsList.forEach(objection => {
      const text = objection.text.toLowerCase();

      // Extract key phrases (3+ consecutive words) for pattern matching
      const words = text.split(/\s+/);
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ');

        // Skip common/generic phrases
        if (!phrase.match(/\b(the|and|for|with|that|this|from|have|been)\b/)) {
          if (!patterns.has(phrase)) {
            patterns.set(phrase, []);
          }
          patterns.get(phrase).push(objection);
        }
      }
    });

    // Find patterns that appear in multiple objections
    const patternList = Array.from(patterns.entries())
      .filter(([_, items]) => items.length >= 2)
      .map(([phrase, items]) => {
        // Get unique objections (same objection might match multiple phrases)
        const uniqueObjections = Array.from(
          new Map(items.map(o => [o.text, o])).values()
        );

        return {
          phrase,
          count: uniqueObjections.length,
          objections: uniqueObjections,
          // Create a summary from the first objection
          summary: uniqueObjections[0].text,
          // Get representative example
          example: uniqueObjections[0].quote || uniqueObjections[0].text.substring(0, 150)
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return patternList;
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading objections...</Text>
      </Box>
    );
  }

  if (error) {
    return <Alert status="error">{error}</Alert>;
  }

  return (
    <Box>
      <Heading mb={6}>Objections & Concerns</Heading>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Objections</StatLabel>
              <StatNumber>{objections.length}</StatNumber>
              <StatHelpText>Across {calls.length} calls</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>High Confidence</StatLabel>
              <StatNumber color="orange.500">
                {objections.filter(o => o.confidence >= 0.8).length}
              </StatNumber>
              <StatHelpText>Strong objections detected</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Patterns Detected</StatLabel>
              <StatNumber color="blue.500">{patterns.length}</StatNumber>
              <StatHelpText>Common objection themes</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Patterns Section */}
      {patterns.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">Common Objection Patterns</Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Recurring concerns across calls
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
                  _hover={{ shadow: 'md', borderColor: 'orange.300' }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                      Objection
                    </Badge>
                    <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                      {pattern.count} occurrences
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
                      borderColor="orange.400"
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
                          View all {pattern.count} related objections
                        </Text>
                        <AccordionIcon ml={2} />
                      </AccordionButton>
                      <AccordionPanel px={0} pb={0}>
                        <VStack spacing={2} align="stretch" mt={2}>
                          {pattern.objections.map((objection, idx) => (
                            <Box
                              key={idx}
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                              fontSize="sm"
                            >
                              <HStack justify="space-between" mb={1}>
                                <Text fontWeight="medium" color="gray.700">
                                  {objection.participantName} {objection.company && `(${objection.company})`}
                                </Text>
                                <Link
                                  as={RouterLink}
                                  to={`/calls/${objection.callId}`}
                                  color="blue.500"
                                  fontSize="xs"
                                >
                                  View Call
                                </Link>
                              </HStack>
                              <Text color="gray.600">{objection.text}</Text>
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

      {/* All Objections */}
      <Card>
        <CardHeader>
          <Heading size="md">All Objections</Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Complete list organized by call
          </Text>
        </CardHeader>
        <CardBody>
          {objections.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No objections found. Start analyzing calls to see insights.
            </Text>
          ) : (
            <Accordion allowMultiple>
              {calls.map((call) => {
                const callObjections = objections.filter(o => o.callId === call.callId);
                if (callObjections.length === 0) return null;

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
                          <Badge colorScheme="orange">{callObjections.length} objections</Badge>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <VStack spacing={4} align="stretch">
                        {callObjections.map((objection, idx) => (
                          <Box
                            key={idx}
                            p={4}
                            bg="orange.50"
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderColor="orange.500"
                          >
                            <HStack justify="space-between" mb={2}>
                              <Badge colorScheme="orange">Objection</Badge>
                              {objection.confidence && (
                                <Text fontSize="xs" color="gray.600">
                                  Confidence: {Math.round(objection.confidence * 100)}%
                                </Text>
                              )}
                            </HStack>
                            <Text fontWeight="medium" mb={2}>
                              {objection.text}
                            </Text>
                            {objection.quote && (
                              <Text
                                fontSize="sm"
                                color="gray.700"
                                fontStyle="italic"
                                borderLeft="3px solid"
                                borderColor="gray.400"
                                pl={3}
                              >
                                "{objection.quote}"
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

export default Objections;
