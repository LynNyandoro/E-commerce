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
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor, getPaymentStatusColor } from '../../utils';

const OrderManagementPage: React.FC = () => {
  const tableBg = 'white';
  const queryClient = useQueryClient();
  const toast = useToast();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: () => ordersAPI.getAll(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }: { id: string; statusData: any }) =>
      ordersAPI.updateStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
       toast({
        title: 'Order updated',
        description: 'The order status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
       toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update order',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string, type: 'status' | 'paymentStatus') => {
    updateStatusMutation.mutate({
      id: orderId,
      statusData: { [type]: newStatus },
    });
  };

  const orders = data?.orders || [];

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Text color="red.500">Error loading orders. Please try again.</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h1" size="xl">
            Manage Orders
          </Heading>
          <HStack gap={4}>
            <Box
              as="select"
              value={filters.status}
              onChange={(e: any) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              minW="150px"
              px={3}
              py={2}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              bg="white"
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
              {...({} as any)}
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Box>
          </HStack>
        </Flex>

        {isLoading ? (
          <Center py={12}>
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : orders.length === 0 ? (
          <Center py={12}>
              <VStack gap={4}>
              <Text fontSize="lg" color="gray.600">
                No orders found.
              </Text>
            </VStack>
          </Center>
        ) : (
           <Box bg={tableBg} _dark={{ bg: 'gray.800' }} borderRadius="lg" overflow="hidden" boxShadow="sm">
             <Table variant="simple">
               <Thead bg="gray.50">
                 <Tr>
                   <Th>Order #</Th>
                   <Th>Customer</Th>
                   <Th>Items</Th>
                   <Th>Total</Th>
                   <Th>Status</Th>
                   <Th>Payment</Th>
                   <Th>Date</Th>
                   <Th>Actions</Th>
                 </Tr>
               </Thead>
               <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td>
                      <Text fontWeight="medium" fontSize="sm">
                        {order.orderNumber}
                      </Text>
                    </Td>
                    <Td>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{order.user.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {order.user.email}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" gap={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                        </Text>
                        {order.items.slice(0, 2).map((item, index) => (
                          <Text 
                            key={index} 
                            fontSize="xs" 
                            color="gray.500" 
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="150px"
                          >
                            {item.artwork.title} × {item.quantity}
                          </Text>
                        ))}
                        {order.items.length > 2 && (
                          <Text fontSize="xs" color="gray.400">
                            +{order.items.length - 2} more
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontWeight="bold" color="brand.600">
                        {formatCurrency(order.total)}
                      </Text>
                    </Td>
                    <Td>
                      <Box
                        as="select"
                        value={order.status}
                        onChange={(e: any) => handleStatusChange(order._id, e.target.value, 'status')}
                        px={2}
                        py={1}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        bg="white"
                        fontSize="sm"
                        minW="120px"
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                        {...({} as any)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </Box>
                    </Td>
                    <Td>
                      <Box
                        as="select"
                        value={order.paymentStatus}
                        onChange={(e: any) => handleStatusChange(order._id, e.target.value, 'paymentStatus')}
                        px={2}
                        py={1}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        bg="white"
                        fontSize="sm"
                        minW="120px"
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                        {...({} as any)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </Box>
                    </Td>
                    <Td>
                      <VStack align="start" gap={0}>
                        <Text fontSize="sm">{formatDate(order.createdAt)}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {order.createdAt}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="brand"
                      >
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
               </Tbody>
             </Table>
          </Box>
        )}

        {/* Pagination would go here */}
      </Container>
    </Box>
  );
};

export default OrderManagementPage;
