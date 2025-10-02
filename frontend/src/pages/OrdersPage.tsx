import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Spinner,
  Center,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import { formatCurrency, formatDate, getStatusColor, getPaymentStatusColor } from '../utils';

const OrdersPage: React.FC = () => {
  const cardBg = 'white';
  const toast = useToast();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-orders', filters],
    queryFn: () => ordersAPI.getAll(filters),
  });

  if (isLoading) {
    return (
      <Center minH="400px">
        <VStack gap={4}>
          <Spinner size="lg" color="brand.500" />
          <Text>Loading your orders...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="400px">
        <VStack gap={4}>
          <Text color="red.500">Failed to load orders</Text>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </VStack>
      </Center>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={6} align="center" textAlign="center">
          <Heading size="lg">Your Orders</Heading>
          <VStack gap={4}>
            <Text fontSize="lg" color="gray.600">
              You haven't placed any orders yet.
            </Text>
            <Button
              as="a"
              href="/artworks"
              colorScheme="brand"
              size="lg"
            >
              Browse Artworks
            </Button>
          </VStack>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="lg">Your Orders</Heading>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          {orders.map((order: any) => (
            <Card key={order._id} bg={cardBg} _dark={{ bg: 'gray.800' }}>
              <CardBody>
                <VStack gap={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold">Order #{order.orderNumber}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(order.createdAt)}
                      </Text>
                    </VStack>
                    <VStack align="end" gap={1}>
                      <Text fontWeight="bold" fontSize="lg">
                        {formatCurrency(order.total)}
                      </Text>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </VStack>
                  </Flex>

                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="medium">Items:</Text>
                    {order.items.map((item: any, index: number) => (
                      <Flex key={index} justify="space-between" align="center">
                        <VStack align="start" gap={0}>
                          <Text fontSize="sm" fontWeight="medium">
                            {item.artwork.title}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            by {item.artwork.artist.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Qty: {item.quantity}
                          </Text>
                        </VStack>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatCurrency(item.price)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>

                  <Flex justify="space-between" align="center" pt={2} borderTop="1px" borderColor="gray.200">
                    <Text fontSize="sm" color="gray.600">
                      Payment: 
                      <Badge 
                        ml={2} 
                        colorScheme={getPaymentStatusColor(order.paymentStatus)}
                        size="sm"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </Text>
                    <Button size="sm" variant="outline" colorScheme="brand">
                      View Details
                    </Button>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <Flex justify="center" gap={2} pt={4}>
            <Button
              disabled={!data.pagination.hasPrev}
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Text alignSelf="center" px={4}>
              Page {data.pagination.currentPage} of {data.pagination.totalPages}
            </Text>
            <Button
              disabled={!data.pagination.hasNext}
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </Flex>
        )}
      </VStack>
    </Container>
  );
};

export default OrdersPage;
