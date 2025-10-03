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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterCredentials } from '../types';

const RegisterPage: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterCredentials & { confirmPassword: string }>>({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = 'white';

  const validateForm = () => {
    const newErrors: Partial<RegisterCredentials & { confirmPassword: string }> = {};

    if (!credentials.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (credentials.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });
      toast({
        title: 'Welcome!',
        description: 'Your account has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Failed to create account',
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
    if (errors[name as keyof typeof errors]) {
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
                  Sign Up Temporarily Disabled
                </Heading>
                <Text color="gray.600">
                  We’re preparing for launch. Please use an existing account to sign in.
                </Text>
              </Box>
              <Box textAlign="center">
                <Button as={RouterLink} to="/login" colorScheme="brand" size="lg">
                  Go to Sign In
                </Button>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
