import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI, artworksAPI, artistsAPI } from '../services/api';
import { formatCurrency } from '../utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DashboardPage: React.FC = () => {
  const cardBg = 'white';

  const { data: orderStats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => ordersAPI.getStats(),
  });

  const { data: artistStats } = useQuery({
    queryKey: ['artist-stats'],
    queryFn: () => artistsAPI.getStats(),
  });

  const { data: topArtists } = useQuery({
    queryKey: ['top-artists'],
    queryFn: () => artistsAPI.getTopSales(5),
  });

  const stats = orderStats?.stats;
  const artistStatsData = artistStats?.stats;

  // Mock data for charts (in a real app, you'd fetch this from the API)
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 13 },
    { name: 'Mar', sales: 2000, orders: 98 },
    { name: 'Apr', sales: 2780, orders: 39 },
    { name: 'May', sales: 1890, orders: 48 },
    { name: 'Jun', sales: 2390, orders: 38 },
  ];

  const categoryData = [
    { name: 'Painting', value: 45, color: '#8884d8' },
    { name: 'Sculpture', value: 20, color: '#82ca9d' },
    { name: 'Digital', value: 15, color: '#ffc658' },
    { name: 'Photography', value: 12, color: '#ff7300' },
    { name: 'Mixed Media', value: 8, color: '#00ff00' },
  ];

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <Heading as="h1" size="xl" mb={8}>
          Admin Dashboard
        </Heading>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <Stat>
                <StatLabel>Total Revenue</StatLabel>
                <StatNumber color="green.500">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <Stat>
                <StatLabel>Total Orders</StatLabel>
                <StatNumber>{stats?.totalOrders || 0}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12.5%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <Stat>
                <StatLabel>Average Order Value</StatLabel>
                <StatNumber>
                  {formatCurrency(stats?.averageOrderValue || 0)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  2.1%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <Stat>
                <StatLabel>Active Artists</StatLabel>
                <StatNumber>{artistStatsData?.totalArtists || 0}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  5.2%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Charts */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} mb={8}>
          {/* Sales Chart */}
          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <VStack gap={4} align="stretch">
                <Heading size="md">Sales Overview</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === 'sales' ? formatCurrency(Number(value)) : value,
                          name === 'sales' ? 'Revenue' : 'Orders'
                        ]}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Category Distribution */}
          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <VStack gap={4} align="stretch">
                <Heading size="md">Category Distribution</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Order Status and Top Artists */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
          {/* Order Status */}
          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <VStack gap={4} align="stretch">
                <Heading size="md">Order Status</Heading>
                <VStack gap={3} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text>Pending</Text>
                    <Text fontWeight="bold" color="yellow.500">
                      {stats?.pendingOrders || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text>Processing</Text>
                    <Text fontWeight="bold" color="blue.500">
                      {stats?.processingOrders || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text>Shipped</Text>
                    <Text fontWeight="bold" color="purple.500">
                      {stats?.shippedOrders || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text>Delivered</Text>
                    <Text fontWeight="bold" color="green.500">
                      {stats?.deliveredOrders || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text>Cancelled</Text>
                    <Text fontWeight="bold" color="red.500">
                      {stats?.cancelledOrders || 0}
                    </Text>
                  </Flex>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Top Artists */}
          <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
            <CardBody>
              <VStack gap={4} align="stretch">
                <Heading size="md">Top Artists by Sales</Heading>
                <VStack gap={3} align="stretch">
                  {topArtists?.topArtists?.map((artist, index) => (
                    <Flex key={artist._id} justify="space-between" align="center">
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">#{index + 1} {artist.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {artist.totalSales} sales
                        </Text>
                      </VStack>
                      <Text fontWeight="bold" color="brand.600">
                        {formatCurrency(artist.totalRevenue)}
                      </Text>
                    </Flex>
                  )) || (
                    <Text color="gray.500" textAlign="center">
                      No data available
                    </Text>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
