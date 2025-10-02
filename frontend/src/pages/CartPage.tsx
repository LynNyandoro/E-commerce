import React from 'react';
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, calculateCartTotals } from '../utils';
import { ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cardBg = 'white';

  const totals = calculateCartTotals(items);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
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
            <BreadcrumbItem isCurrentPage>
              <Text>Cart</Text>
            </BreadcrumbItem>
          </Breadcrumb>

          <VStack gap={8} py={12}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.600">
              Your cart is empty
            </Text>
            <Text color="gray.500" textAlign="center">
              Looks like you haven't added any artworks to your cart yet.
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
          <BreadcrumbItem isCurrentPage>
            <Text>Cart</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="xl" mb={8}>
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </Heading>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          {/* Cart Items */}
          <Box flex="1">
            <VStack gap={4} align="stretch">
              {items.map((item) => (
                <Card key={item.artwork._id} bg={cardBg} _dark={{ bg: 'gray.800' }}>
                  <CardBody>
                    <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
                      <Image
                        src={item.artwork.primaryImage || item.artwork.images[0]?.url}
                        alt={item.artwork.title}
                        boxSize="120px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      
                      <Box flex="1">
                        <VStack align="start" gap={2}>
                          <Heading size="md">
                            {item.artwork.title}
                          </Heading>
                          <Text color="gray.600">
                            by {item.artwork.artist.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {item.artwork.formattedDimensions}
                          </Text>
                        </VStack>
                      </Box>

                      <VStack gap={4} align="end">
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeItem(item.artwork._id)}
                          leftIcon={<DeleteIcon />}
                        >
                          Remove
                        </Button>

                        <VStack gap={2} align="end">
                          <HStack gap={2}>
                            <Button
                              size="sm"
                              onClick={() => updateQuantity(item.artwork._id, item.quantity - 1)}
                              isDisabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Text minW="20px" textAlign="center">
                              {item.quantity}
                            </Text>
                            <Button
                              size="sm"
                              onClick={() => updateQuantity(item.artwork._id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </HStack>
                          <Text fontSize="lg" fontWeight="bold" color="brand.600">
                            {formatCurrency(item.artwork.price * item.quantity)}
                          </Text>
                        </VStack>
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>

            <Flex justify="space-between" mt={6}>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button
                as={RouterLink}
                to="/artworks"
                variant="outline"
              >
                Continue Shopping
              </Button>
            </Flex>
          </Box>

          {/* Order Summary */}
          <Box minW="350px">
            <Card bg={cardBg} _dark={{ bg: 'gray.800' }} position="sticky" top="4">
              <CardBody>
                <VStack gap={4} align="stretch">
                  <Heading size="md">Order Summary</Heading>
                  
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

                  {totals.subtotal >= 100 && (
                    <Text fontSize="sm" color="green.600" textAlign="center">
                      🎉 You qualify for free shipping!
                    </Text>
                  )}

                  <Button
                    size="lg"
                    colorScheme="brand"
                    onClick={handleCheckout}
                    width="full"
                  >
                    Proceed to Checkout
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CartPage;
