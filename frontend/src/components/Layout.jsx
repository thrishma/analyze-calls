import { Box, Container, Flex, Heading, Button, HStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <Box>
      {/* Navigation Bar */}
      <Box bg="blue.600" color="white" py={4} px={6} shadow="md">
        <Container maxW="full" px={8}>
          <Flex justify="space-between" align="center">
            <Heading as={RouterLink} to="/" size="md" cursor="pointer" _hover={{ color: 'white', textDecoration: 'none' }}>
              📞 Call Analysis Platform
            </Heading>
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
      <Container maxW="full" px={8} py={8}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
