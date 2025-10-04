import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Link,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const cardBg = 'white';

  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(credentials);
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Box py={12}>
      <Container maxW="md">
        <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
          <CardBody p={8}>
            <VStack gap={6} align="stretch">
              <Box textAlign="center">
                <Heading as="h1" size="xl" mb={2}>
                  Sign In
                </Heading>
                <Text color="gray.600">
                  Welcome back! Please sign in to your account.
                </Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>

              <Box textAlign="center">
                <Text color="gray.600">
                  Don't have an account?{' '}
                  <Link as={RouterLink} to="/register" color="brand.600">
                    Sign up here
                  </Link>
                </Text>
              </Box>

              {/* Demo Credentials */}
              <Box p={4} bg="gray.50" borderRadius="md" fontSize="sm">
                <Text fontWeight="bold" mb={2}>Admin Demo Credentials:</Text>
                <Text>Admin: admin@artgallery.com / admin123</Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
