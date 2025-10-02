import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Card,
  CardBody,
  Flex,
  Heading,
  Divider,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import { formatCurrency, calculateCartTotals } from '../utils';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { ShippingAddress } from '../types';

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = 'white';

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const totals = calculateCartTotals(items);

  const validateForm = () => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!shippingAddress.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const orderData = {
        items: items.map(item => ({
          artwork: item.artwork._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        notes: notes.trim() || undefined,
      };

      const response = await ordersAPI.create(orderData);
      
       toast({
        title: 'Order placed successfully!',
        description: `Your order #${response.order.orderNumber} has been placed.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      clearCart();
      navigate('/');
    } catch (error: any) {
       toast({
        title: 'Order failed',
        description: error.response?.data?.message || 'Failed to place order',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ShippingAddress]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (items.length === 0) {
    return (
      <Box py={8}>
        <Container maxW="container.xl">
          <VStack gap={8} py={12}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.600">
              Your cart is empty
            </Text>
            <Button
              as={RouterLink}
              to="/artworks"
              size="lg"
              colorScheme="brand"
            >
              Browse Artworks
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        {/* Breadcrumb */}
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={8}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/cart">
              Cart
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Checkout</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="xl" mb={8}>
          Checkout
        </Heading>

        <form onSubmit={handleSubmit}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            {/* Shipping Information */}
            <Box flex="1">
              <VStack gap={6} align="stretch">
                {/* Shipping Address */}
                <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
                  <CardBody>
                    <VStack gap={4} align="stretch">
                      <Heading size="md">Shipping Address</Heading>
                      
                      <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          name="name"
                          value={shippingAddress.name}
                          onChange={handleAddressChange}
                          placeholder="Enter your full name"
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.street}>
                        <FormLabel>Street Address</FormLabel>
                        <Input
                          name="street"
                          value={shippingAddress.street}
                          onChange={handleAddressChange}
                          placeholder="Enter your street address"
                        />
                        <FormErrorMessage>{errors.street}</FormErrorMessage>
                      </FormControl>

                      <HStack gap={4}>
                        <FormControl isInvalid={!!errors.city}>
                          <FormLabel>City</FormLabel>
                          <Input
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                          />
                          <FormErrorMessage>{errors.city}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.state}>
                          <FormLabel>State</FormLabel>
                          <Input
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleAddressChange}
                            placeholder="State"
                          />
                          <FormErrorMessage>{errors.state}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.zipCode}>
                          <FormLabel>ZIP Code</FormLabel>
                          <Input
                            name="zipCode"
                            value={shippingAddress.zipCode}
                            onChange={handleAddressChange}
                            placeholder="ZIP"
                          />
                          <FormErrorMessage>{errors.zipCode}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl isInvalid={!!errors.country}>
                        <FormLabel>Country</FormLabel>
                        <Input
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleAddressChange}
                          placeholder="Country"
                        />
                        <FormErrorMessage>{errors.country}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <Input
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special instructions?"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>

            {/* Order Summary */}
            <Box minW="350px">
              <Card bg={cardBg} _dark={{ bg: 'gray.800' }} position="sticky" top="4">
                <CardBody>
                  <VStack gap={4} align="stretch">
                    <Heading size="md">Order Summary</Heading>
                    
                    {/* Items */}
                    <VStack gap={3} align="stretch" maxH="300px" overflowY="auto">
                      {items.map((item) => (
                        <HStack key={item.artwork._id} gap={3}>
                          <Image
                            src={item.artwork.primaryImage || item.artwork.images[0]?.url}
                            alt={item.artwork.title}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                              {item.artwork.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              Qty: {item.quantity}
                            </Text>
                          </Box>
                          <Text fontSize="sm" fontWeight="bold">
                            {formatCurrency(item.artwork.price * item.quantity)}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                    
                       <Divider />
                    
                    <VStack gap={3} align="stretch">
                      <Flex justify="space-between">
                        <Text>Subtotal</Text>
                        <Text>{formatCurrency(totals.subtotal)}</Text>
                      </Flex>
                      
                      <Flex justify="space-between">
                        <Text>Tax (8%)</Text>
                        <Text>{formatCurrency(totals.tax)}</Text>
                      </Flex>
                      
                      <Flex justify="space-between">
                        <Text>Shipping</Text>
                        <Text>
                          {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
                        </Text>
                      </Flex>
                      
                      <Divider />
                      
                      <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                        <Text>Total</Text>
                        <Text color="brand.600">{formatCurrency(totals.total)}</Text>
                      </Flex>
                    </VStack>

                    <Button
                      type="submit"
                      size="lg"
                      colorScheme="brand"
                      width="full"
                    >
                      Place Order
                    </Button>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      This is a demo checkout. No real payment will be processed.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </Flex>
        </form>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
