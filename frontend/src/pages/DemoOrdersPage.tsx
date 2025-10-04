import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Card,
  CardBody,
  Image,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, formatDate } from '../utils';

interface DemoOrder {
  id: string;
  orderNumber: string;
  items: Array<{
    artwork: {
      _id: string;
      title: string;
      price: number;
      images: Array<{ url: string; alt: string }>;
    };
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

const DemoOrdersPage: React.FC = () => {
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const toast = useToast();

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('demoOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading demo orders:', error);
      }
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('demoOrders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before placing an order.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingOrder(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOrder: DemoOrder = {
      id: `demo-${Date.now()}`,
      orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: cartItems.map(item => ({
        artwork: {
          _id: item.artwork._id,
          title: item.artwork.title,
          price: item.artwork.price,
          images: item.artwork.images,
        },
        quantity: item.quantity,
      })),
      total: totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    toast({
      title: 'Order placed successfully!',
      description: `Order #${newOrder.orderNumber} has been created.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    setIsCreatingOrder(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <Box py={8}>
      <Container maxW="6xl">
        <VStack gap={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              My Orders
            </Heading>
            <Text color="gray.600">
              Demo mode - No authentication required
            </Text>
          </Box>

          {cartItems.length > 0 && (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Items in Cart!</AlertTitle>
                <AlertDescription>
                  You have {cartItems.length} item(s) in your cart. Place an order to see it in your order history.
                </AlertDescription>
              </Box>
              <Button
                ml={4}
                colorScheme="blue"
                onClick={createOrder}
                isLoading={isCreatingOrder}
                loadingText="Creating Order..."
              >
                Place Order
              </Button>
            </Alert>
          )}

          {orders.length === 0 ? (
            <Card>
              <CardBody textAlign="center" py={12}>
                <Text fontSize="lg" color="gray.600" mb={4}>
                  No orders yet
                </Text>
                <Text color="gray.500">
                  Add items to your cart and place an order to see them here.
                </Text>
              </CardBody>
            </Card>
          ) : (
            <VStack gap={4} align="stretch">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardBody>
                    <VStack gap={4} align="stretch">
                      <HStack justify="space-between" align="flex-start">
                        <Box>
                          <Text fontWeight="bold" fontSize="lg">
                            Order #{order.orderNumber}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            Placed on {formatDate(order.createdAt)}
                          </Text>
                        </Box>
                        <VStack align="end" gap={2}>
                          <Badge
                            colorScheme={getStatusColor(order.status)}
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {getStatusText(order.status)}
                          </Badge>
                          <Text fontWeight="bold" fontSize="lg">
                            {formatCurrency(order.total)}
                          </Text>
                        </VStack>
                      </HStack>

                      <Divider />

                      <VStack gap={3} align="stretch">
                        {order.items.map((item, index) => (
                          <HStack key={index} gap={4}>
                            <Image
                              src={item.artwork.images[0]?.url || '/placeholder.jpg'}
                              alt={item.artwork.images[0]?.alt || item.artwork.title}
                              boxSize="60px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <Box flex={1}>
                              <Text fontWeight="medium">
                                {item.artwork.title}
                              </Text>
                              <Text color="gray.600" fontSize="sm">
                                Quantity: {item.quantity}
                              </Text>
                            </Box>
                            <Text fontWeight="medium">
                              {formatCurrency(item.artwork.price * item.quantity)}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default DemoOrdersPage;
