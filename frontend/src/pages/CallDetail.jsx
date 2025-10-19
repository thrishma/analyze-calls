import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Alert,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { api } from '../api/client';

function CallDetail() {
  const { callId } = useParams();
  const [callData, setCallData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCallData();
  }, [callId]);

  const loadCallData = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCall(callId);
      setCallData(data);
    } catch (err) {
      console.error('Error loading call:', err);
      setError(err.response?.data?.error || 'Failed to load call data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading call data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        {error}
      </Alert>
    );
  }

  if (!callData) {
    return (
      <Alert status="warning">
        Call not found
      </Alert>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Card mb={6}>
        <CardBody>
          <Heading size="lg" mb={4}>
            Call with {callData.participantName || 'Unknown'}
          </Heading>
          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.600">
              Date: {new Date(callData.callDate).toLocaleDateString()}
            </Text>
            {callData.company && (
              <Text fontSize="sm" color="gray.600">
                Company: {callData.company}
              </Text>
            )}
            {callData.metadata?.transcriptWordCount && (
              <Text fontSize="sm" color="gray.600">
                Words: {callData.metadata.transcriptWordCount}
              </Text>
            )}
          </HStack>
        </CardBody>
      </Card>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Left Column - Insights */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Pain Points */}
            <Card>
              <CardHeader>
                <Heading size="md">
                  Pain Points ({callData.insights?.painPoints?.length || 0})
                </Heading>
              </CardHeader>
              <CardBody>
                {callData.insights?.painPoints?.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {callData.insights.painPoints.map((painPoint, index) => (
                      <Box
                        key={index}
                        p={4}
                        borderLeft="4px solid"
                        borderColor={`${getSeverityColor(painPoint.severity)}.400`}
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <HStack mb={2}>
                          <Badge colorScheme={getSeverityColor(painPoint.severity)}>
                            {painPoint.severity}
                          </Badge>
                          {painPoint.confidence && (
                            <Badge colorScheme="blue">
                              {Math.round(painPoint.confidence * 100)}% confidence
                            </Badge>
                          )}
                        </HStack>
                        <Text fontWeight="bold" mb={2}>
                          {painPoint.text}
                        </Text>
                        <Text fontSize="sm" fontStyle="italic" color="gray.600">
                          "{painPoint.quote}"
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500">No pain points identified</Text>
                )}
              </CardBody>
            </Card>

            {/* Feature Requests */}
            <Card>
              <CardHeader>
                <Heading size="md">
                  Feature Requests ({callData.insights?.featureRequests?.length || 0})
                </Heading>
              </CardHeader>
              <CardBody>
                {callData.insights?.featureRequests?.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {callData.insights.featureRequests.map((feature, index) => (
                      <Box
                        key={index}
                        p={4}
                        borderLeft="4px solid"
                        borderColor="blue.400"
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <HStack mb={2}>
                          <Badge colorScheme="blue">{feature.priority}</Badge>
                          {feature.confidence && (
                            <Badge colorScheme="blue">
                              {Math.round(feature.confidence * 100)}% confidence
                            </Badge>
                          )}
                        </HStack>
                        <Text fontWeight="bold" mb={2}>
                          {feature.text}
                        </Text>
                        <Text fontSize="sm" fontStyle="italic" color="gray.600">
                          "{feature.quote}"
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500">No feature requests identified</Text>
                )}
              </CardBody>
            </Card>

            {/* Objections */}
            <Card>
              <CardHeader>
                <Heading size="md">
                  Objections & Concerns ({callData.insights?.objections?.length || 0})
                </Heading>
              </CardHeader>
              <CardBody>
                {callData.insights?.objections?.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {callData.insights.objections.map((objection, index) => (
                      <Box
                        key={index}
                        p={4}
                        borderLeft="4px solid"
                        borderColor="orange.400"
                        bg="gray.50"
                        borderRadius="md"
                      >
                        {objection.confidence && (
                          <Badge colorScheme="blue" mb={2}>
                            {Math.round(objection.confidence * 100)}% confidence
                          </Badge>
                        )}
                        <Text fontWeight="bold" mb={2}>
                          {objection.text}
                        </Text>
                        <Text fontSize="sm" fontStyle="italic" color="gray.600">
                          "{objection.quote}"
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500">No objections identified</Text>
                )}
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* Right Column - LinkedIn Profile & Transcript */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* LinkedIn Profile */}
            {callData.linkedInProfile && !callData.linkedInProfile.error && (
              <Card>
                <CardHeader>
                  <Heading size="md">LinkedIn Profile</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    {callData.linkedInProfile.currentRole && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Current Role
                        </Text>
                        <Text>{callData.linkedInProfile.currentRole}</Text>
                      </Box>
                    )}
                    {callData.linkedInProfile.company && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Company
                        </Text>
                        <Text>{callData.linkedInProfile.company}</Text>
                      </Box>
                    )}
                    {callData.linkedInProfile.pastExperience?.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={2}>
                          Past Experience
                        </Text>
                        <VStack align="stretch" spacing={2}>
                          {callData.linkedInProfile.pastExperience.map((exp, index) => (
                            <Box key={index} fontSize="sm">
                              <Text fontWeight="medium">{exp.role}</Text>
                              <Text color="gray.600">
                                {exp.company} • {exp.duration}
                              </Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                    {callData.linkedInProfile.skills?.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={2}>
                          Skills
                        </Text>
                        <HStack flexWrap="wrap" spacing={2}>
                          {callData.linkedInProfile.skills.map((skill, index) => (
                            <Badge key={index} colorScheme="purple">
                              {skill}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Additional Notes */}
            {callData.notes && (
              <Card>
                <CardHeader>
                  <Heading size="md">Additional Notes</Heading>
                </CardHeader>
                <CardBody>
                  <Box
                    p={4}
                    bg="blue.50"
                    borderLeft="4px solid"
                    borderColor="blue.400"
                    borderRadius="md"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                  >
                    {callData.notes}
                  </Box>
                </CardBody>
              </Card>
            )}

            {/* Transcript */}
            {callData.transcript && (
              <Card>
                <CardHeader>
                  <Heading size="md">Full Transcript</Heading>
                </CardHeader>
                <CardBody>
                  <Accordion allowToggle>
                    <AccordionItem border="none">
                      <AccordionButton px={0}>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="medium">Show transcript</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel px={0} pb={4}>
                        <Box
                          maxH="500px"
                          overflowY="auto"
                          p={4}
                          bg="gray.50"
                          borderRadius="md"
                          fontSize="sm"
                          whiteSpace="pre-wrap"
                        >
                          {callData.transcript}
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            )}
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default CallDetail;
