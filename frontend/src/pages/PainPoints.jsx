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
  Divider,
  Link,
  Tag,
} from '@chakra-ui/react';
import { api } from '../api/client';
import { useDemoMode } from '../hooks/useDemoMode';

function PainPoints() {
  const [calls, setCalls] = useState([]);
  const [painPoints, setPainPoints] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDemoMode, demoCalls } = useDemoMode();

  useEffect(() => {
    loadPainPoints();
  }, [isDemoMode]);

  const loadPainPoints = async () => {
    try {
      setIsLoading(true);

      let callsData = [];
      if (isDemoMode) {
        // Use demo data - format it to match API response
        callsData = demoCalls.map(call => ({
          callId: call.callId,
          participantName: call.metadata.participantName,
          company: call.metadata.company,
          callDate: call.metadata.callDate,
          insights: {
            painPoints: call.analysis.painPoints.map(pp => ({
              text: pp.description,
              severity: pp.severity,
              quote: pp.quote,
              confidence: pp.confidence,
              category: pp.category
            }))
          }
        }));
      } else {
        const data = await api.getCalls();
        callsData = data.calls || [];
      }

      setCalls(callsData);

      // Extract all pain points from all calls
      const allPainPoints = [];
      callsData.forEach(call => {
        if (call.insights?.painPoints) {
          call.insights.painPoints.forEach(painPoint => {
            allPainPoints.push({
              ...painPoint,
              callId: call.callId,
              callDate: call.callDate,
              participantName: call.participantName,
              company: call.company,
            });
          });
        }
      });

      setPainPoints(allPainPoints);

      // Detect patterns
      const detectedPatterns = detectPatterns(allPainPoints);
      setPatterns(detectedPatterns);

    } catch (err) {
      console.error('Error loading pain points:', err);
      setError(err.response?.data?.error || 'Failed to load pain points');
    } finally {
      setIsLoading(false);
    }
  };

  const detectPatterns = (painPointsList) => {
    // Group pain points by similarity in text
    const patterns = new Map();

    painPointsList.forEach(pp => {
      const text = pp.text.toLowerCase();

      // Extract key phrases (3+ consecutive words) for pattern matching
      const words = text.split(/\s+/);
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ');

        // Skip common/generic phrases
        if (!phrase.match(/\b(the|and|for|with|that|this|from|have|been)\b/)) {
          if (!patterns.has(phrase)) {
            patterns.set(phrase, []);
          }
          patterns.get(phrase).push(pp);
        }
      }
    });

    // Find patterns that appear in multiple pain points
    const patternList = Array.from(patterns.entries())
      .filter(([_, points]) => points.length >= 2)
      .map(([phrase, points]) => {
        // Get unique pain points (same pain point might match multiple phrases)
        const uniquePainPoints = Array.from(
          new Map(points.map(p => [p.text, p])).values()
        );

        return {
          phrase,
          count: uniquePainPoints.length,
          painPoints: uniquePainPoints,
          severity: calculateAverageSeverity(uniquePainPoints),
          // Create a summary from the first pain point
          summary: uniquePainPoints[0].text,
          // Get representative example
          example: uniquePainPoints[0].quote || uniquePainPoints[0].text.substring(0, 150)
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 patterns

    return patternList;
  };

  const calculateAverageSeverity = (points) => {
    const severityMap = { high: 3, medium: 2, low: 1 };
    const avg = points.reduce((sum, p) => sum + (severityMap[p.severity] || 0), 0) / points.length;
    if (avg >= 2.5) return 'high';
    if (avg >= 1.5) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading pain points...</Text>
      </Box>
    );
  }

  if (error) {
    return <Alert status="error">{error}</Alert>;
  }

  return (
    <Box>
      <Heading mb={6}>Pain Points Analysis</Heading>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Pain Points</StatLabel>
              <StatNumber>{painPoints.length}</StatNumber>
              <StatHelpText>Across {calls.length} calls</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>High Severity</StatLabel>
              <StatNumber color="red.500">
                {painPoints.filter(p => p.severity === 'high').length}
              </StatNumber>
              <StatHelpText>Require immediate attention</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Patterns Detected</StatLabel>
              <StatNumber color="blue.500">{patterns.length}</StatNumber>
              <StatHelpText>Common themes identified</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Patterns Section */}
      {patterns.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">Common Patterns</Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Recurring themes across multiple calls
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
                    <Badge colorScheme={getSeverityColor(pattern.severity)} fontSize="md" px={3} py={1}>
                      {pattern.severity} severity
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
                      borderColor="blue.400"
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
                          View all {pattern.count} related pain points
                        </Text>
                        <AccordionIcon ml={2} />
                      </AccordionButton>
                      <AccordionPanel px={0} pb={0}>
                        <VStack spacing={2} align="stretch" mt={2}>
                          {pattern.painPoints.map((pp, idx) => (
                            <Box
                              key={idx}
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                              fontSize="sm"
                            >
                              <HStack justify="space-between" mb={1}>
                                <Text fontWeight="medium" color="gray.700">
                                  {pp.participantName} {pp.company && `(${pp.company})`}
                                </Text>
                                <Link
                                  as={RouterLink}
                                  to={isDemoMode ? `/calls/${pp.callId}?demo=true` : `/calls/${pp.callId}`}
                                  color="blue.500"
                                  fontSize="xs"
                                >
                                  View Call
                                </Link>
                              </HStack>
                              <Text color="gray.600">{pp.text}</Text>
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

      {/* All Pain Points */}
      <Card>
        <CardHeader>
          <Heading size="md">All Pain Points</Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Complete list organized by call
          </Text>
        </CardHeader>
        <CardBody>
          {painPoints.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No pain points found. Start analyzing calls to see insights.
            </Text>
          ) : (
            <Accordion allowMultiple>
              {calls.map((call) => {
                const callPainPoints = painPoints.filter(p => p.callId === call.callId);
                if (callPainPoints.length === 0) return null;

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
                          <Badge colorScheme="red">{callPainPoints.length} pain points</Badge>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <VStack spacing={4} align="stretch">
                        {callPainPoints.map((painPoint, idx) => (
                          <Box
                            key={idx}
                            p={4}
                            bg="red.50"
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderColor={`${getSeverityColor(painPoint.severity)}.500`}
                          >
                            <HStack justify="space-between" mb={2}>
                              <Badge colorScheme={getSeverityColor(painPoint.severity)}>
                                {painPoint.severity}
                              </Badge>
                              {painPoint.confidence && (
                                <Text fontSize="xs" color="gray.600">
                                  Confidence: {Math.round(painPoint.confidence * 100)}%
                                </Text>
                              )}
                            </HStack>
                            <Text fontWeight="medium" mb={2}>
                              {painPoint.text}
                            </Text>
                            {painPoint.quote && (
                              <Text
                                fontSize="sm"
                                color="gray.700"
                                fontStyle="italic"
                                borderLeft="3px solid"
                                borderColor="gray.400"
                                pl={3}
                              >
                                "{painPoint.quote}"
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

export default PainPoints;
