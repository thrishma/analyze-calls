import { Box, Container, Flex, Heading, Button, HStack, Text, Link, Icon, Badge } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { useDemoMode } from '../hooks/useDemoMode';

function Layout({ children }) {
  const { isDemoMode } = useDemoMode();

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Box bg="blue.600" color="white" py={4} px={6} shadow="md">
        <Container maxW="full" px={8}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Heading as={RouterLink} to="/" size="md" cursor="pointer" _hover={{ color: 'white', textDecoration: 'none' }}>
                📞 Call Analyzer
              </Heading>
              {isDemoMode && (
                <Badge colorScheme="yellow" fontSize="xs" px={2} py={1}>
                  🎬 DEMO MODE
                </Badge>
              )}
            </HStack>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                color="white"
                _hover={{ bg: 'blue.500', color: 'white' }}
              >
                Dashboard
              </Button>
              <Button
                as={RouterLink}
                to="/upload"
                variant="ghost"
                color="white"
                _hover={{ bg: 'blue.500', color: 'white' }}
              >
                Upload Call
              </Button>
              <Button
                as={RouterLink}
                to="/chatbot"
                variant="ghost"
                color="white"
                _hover={{ bg: 'blue.500', color: 'white' }}
              >
                Chatbot
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="full" px={8} py={8} flex="1">
        {children}
      </Container>

      {/* Footer */}
      <Box bg="gray.100" py={4} px={6} borderTop="1px" borderColor="gray.200">
        <Container maxW="full" px={8}>
          <Flex justify="center" align="center" gap={2}>
            <Text fontSize="sm" color="gray.600">
              Developed by
            </Text>
            <Link
              href="https://www.linkedin.com/in/thrishma-reddy/"
              isExternal
              color="blue.600"
              _hover={{ color: 'blue.700' }}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaLinkedin} />
              <Text fontSize="sm">Thrishma Reddy</Text>
            </Link>
            <Text fontSize="sm" color="gray.600">•</Text>
            <Link
              href="https://github.com/thrishma"
              isExternal
              color="blue.600"
              _hover={{ color: 'blue.700' }}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaGithub} />
              <Text fontSize="sm">GitHub</Text>
            </Link>
            <Text fontSize="sm" color="gray.600">•</Text>
            <Link
              href="https://github.com/thrishma/analyze-calls"
              isExternal
              color="blue.600"
              _hover={{ color: 'blue.700' }}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaGithub} />
              <Text fontSize="sm">Source Code</Text>
            </Link>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
