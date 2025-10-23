import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  Spinner,
  Alert,
  SimpleGrid,
  Link,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { api } from '../api/client';
import { DeleteIcon } from '@chakra-ui/icons';

function Home() {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      setIsLoading(true);
      // Load all calls for accurate stats, but only show recent 10 in the list
      const data = await api.getCalls({ sortBy: 'date', order: 'desc' });
      setCalls(data.calls || []);
    } catch (err) {
      console.error('Error loading calls:', err);
      setError(err.response?.data?.error || 'Failed to load calls');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCall = async (callId) => {
    try {
      await api.deleteCall(callId);
      toast({
        title: 'Success',
        description: 'Call deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Reload calls after deletion
      loadCalls();
    } catch (err) {
      console.error('Error deleting call:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to delete call',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateStats = () => {
    const totalCalls = calls.length;
    const totalPainPoints = calls.reduce(
      (sum, call) => sum + (call.insightsCount?.painPoints || 0),
      0
    );
    const totalFeatures = calls.reduce(
      (sum, call) => sum + (call.insightsCount?.featureRequests || 0),
      0
    );
    const totalObjections = calls.reduce(
      (sum, call) => sum + (call.insightsCount?.objections || 0),
      0
    );

    return { totalCalls, totalPainPoints, totalFeatures, totalObjections };
  };

  const getAggregateSummary = () => {
    if (calls.length <= 1) return null;

    // Extract all insights from all calls
    const allPainPoints = [];
    const allFeatures = [];
    const allObjections = [];

    calls.forEach(call => {
      if (call.insights?.painPoints) {
        allPainPoints.push(...call.insights.painPoints);
      }
      if (call.insights?.featureRequests) {
        allFeatures.push(...call.insights.featureRequests);
      }
      if (call.insights?.objections) {
        allObjections.push(...call.insights.objections);
      }
    });

    // Top pain points by severity
    const topPainPoints = allPainPoints
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      })
      .slice(0, 5);

    // Top feature requests by priority
    const topFeatures = allFeatures
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      })
      .slice(0, 5);

    // Most common objections
    const topObjections = allObjections.slice(0, 5);

    return {
      topPainPoints,
      topFeatures,
      topObjections,
      highSeverityPainPoints: allPainPoints.filter(p => p.severity === 'high').length,
      highPriorityFeatures: allFeatures.filter(f => f.priority === 'high').length,
    };
  };

  const stats = calculateStats();
  const aggregateSummary = getAggregateSummary();

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading dashboard...</Text>
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

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Heading>Dashboard</Heading>
        <HStack>
          <Button as={RouterLink} to="/upload" colorScheme="blue" size="lg" _hover={{ bg: 'blue.600', color: 'white' }}>
            Analyze New Call
          </Button>
          <Button as={RouterLink} to="/chatbot" variant="outline" colorScheme="blue" size="lg">
            Ask Chatbot
          </Button>
        </HStack>
      </HStack>

      {/* Empty State - Show when no calls */}
      {calls.length === 0 ? (
        <Card mb={8}>
          <CardBody>
            <VStack spacing={6} py={12}>
              <Box fontSize="6xl">📞</Box>
              <VStack spacing={2}>
                <Heading size="lg">Welcome to Call Analyzer</Heading>
                <Text color="gray.600" textAlign="center" maxW="md">
                  Get started by analyzing your first customer discovery call. Upload a transcript to extract insights, pain points, and feature requests automatically.
                </Text>
              </VStack>
              <VStack spacing={3} align="stretch" w="full" maxW="md">
                <Button
                  as={RouterLink}
                  to="/upload"
                  colorScheme="blue"
                  size="lg"
                  _hover={{ bg: 'blue.600', color: 'white' }}
                >
                  Upload Your First Call
                </Button>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  💡 Tip: You can upload just a transcript, just notes, or both!
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Total Calls</Text>
                  <Heading size="2xl">{stats.totalCalls}</Heading>
                  <Text fontSize="xs" color="gray.500">Analyzed</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card
              as={RouterLink}
              to="/pain-points"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
            >
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Pain Points</Text>
                  <Heading size="2xl" color="red.500">{stats.totalPainPoints}</Heading>
                  <Text fontSize="xs" color="gray.500">Identified • Click to view</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card
              as={RouterLink}
              to="/feature-requests"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
            >
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Feature Requests</Text>
                  <Heading size="2xl" color="blue.500">{stats.totalFeatures}</Heading>
                  <Text fontSize="xs" color="gray.500">Collected • Click to view</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card
              as={RouterLink}
              to="/objections"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
            >
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Objections</Text>
                  <Heading size="2xl" color="orange.500">{stats.totalObjections}</Heading>
                  <Text fontSize="xs" color="gray.500">Noted • Click to view</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Aggregate Summary */}
          {aggregateSummary && (
            <Card mb={8}>
              <CardHeader>
                <Heading size="md">Insights Summary</Heading>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Key findings across all {calls.length} calls
                </Text>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6}>
                  {/* Top Pain Points */}
                  <GridItem>
                    <VStack align="stretch" spacing={3} h="full">
                      <HStack justify="space-between">
                        <Heading size="sm" color="red.600">
                          Top Pain Points
                        </Heading>
                        <Badge colorScheme="red">
                          {aggregateSummary.highSeverityPainPoints} high severity
                        </Badge>
                      </HStack>
                      <VStack spacing={2} align="stretch" flex={1}>
                        {aggregateSummary.topPainPoints.map((pp, idx) => (
                          <Box
                            key={idx}
                            p={3}
                            bg="red.50"
                            borderRadius="md"
                            borderLeft="3px solid"
                            borderColor="red.500"
                          >
                            <HStack mb={1}>
                              <Badge colorScheme="red" size="sm">
                                {pp.severity}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" noOfLines={2}>
                              {pp.text}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                      <Button
                        as={RouterLink}
                        to="/pain-points"
                        colorScheme="red"
                        variant="outline"
                        width="full"
                      >
                        View All Pain Points
                      </Button>
                    </VStack>
                  </GridItem>

                  {/* Top Feature Requests */}
                  <GridItem>
                    <VStack align="stretch" spacing={3} h="full">
                      <HStack justify="space-between">
                        <Heading size="sm" color="blue.600">
                          Top Feature Requests
                        </Heading>
                        <Badge colorScheme="blue">
                          {aggregateSummary.highPriorityFeatures} high priority
                        </Badge>
                      </HStack>
                      <VStack spacing={2} align="stretch" flex={1}>
                        {aggregateSummary.topFeatures.map((feature, idx) => (
                          <Box
                            key={idx}
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            borderLeft="3px solid"
                            borderColor="blue.500"
                          >
                            <HStack mb={1}>
                              <Badge colorScheme="blue" size="sm">
                                {feature.priority}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" noOfLines={2}>
                              {feature.text}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                      <Button
                        as={RouterLink}
                        to="/feature-requests"
                        colorScheme="blue"
                        variant="outline"
                        width="full"
                      >
                        View All Features
                      </Button>
                    </VStack>
                  </GridItem>

                  {/* Top Objections */}
                  <GridItem>
                    <VStack align="stretch" spacing={3} h="full">
                      <Heading size="sm" color="orange.600">
                        Common Objections
                      </Heading>
                      <VStack spacing={2} align="stretch" flex={1}>
                        {aggregateSummary.topObjections.map((objection, idx) => (
                          <Box
                            key={idx}
                            p={3}
                            bg="orange.50"
                            borderRadius="md"
                            borderLeft="3px solid"
                            borderColor="orange.500"
                          >
                            <Text fontSize="sm" noOfLines={2}>
                              {objection.text}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                      <Button
                        as={RouterLink}
                        to="/objections"
                        colorScheme="orange"
                        variant="outline"
                        width="full"
                      >
                        View All Objections
                      </Button>
                    </VStack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          )}

          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <Heading size="md">Recent Calls</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {calls.slice(0, 10).map((call) => (
                  <CallCard key={call.callId} call={call} onDelete={() => handleDeleteCall(call.callId)} />
                ))}
              </VStack>
            </CardBody>
          </Card>
        </>
      )}
    </Box>
  );
}

function CallCard({ call, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useState(null);

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    onOpen();
  };

  const confirmDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      <Box
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        _hover={{ shadow: 'md', borderColor: 'blue.300' }}
        transition="all 0.2s"
        position="relative"
      >
        <Link as={RouterLink} to={`/calls/${call.callId}`} _hover={{ textDecoration: 'none' }}>
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={4}>
            <GridItem>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Heading size="sm">{call.participantName || 'Unknown'}</Heading>
                  {call.company && (
                    <Badge colorScheme="purple">{call.company}</Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {call.summary}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date(call.callDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align={{ base: 'start', md: 'end' }} spacing={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Insights
                </Text>
                <HStack spacing={3}>
                  {call.insightsCount?.painPoints > 0 && (
                    <Badge colorScheme="red">
                      {call.insightsCount.painPoints} Pain Points
                    </Badge>
                  )}
                  {call.insightsCount?.featureRequests > 0 && (
                    <Badge colorScheme="blue">
                      {call.insightsCount.featureRequests} Features
                    </Badge>
                  )}
                  {call.insightsCount?.objections > 0 && (
                    <Badge colorScheme="orange">
                      {call.insightsCount.objections} Objections
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </GridItem>
          </Grid>
        </Link>

        {/* Delete Button */}
        <IconButton
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="red"
          variant="ghost"
          position="absolute"
          bottom={2}
          right={2}
          onClick={handleDeleteClick}
          aria-label="Delete call"
        />
      </Box>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Call
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this call? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Home;
