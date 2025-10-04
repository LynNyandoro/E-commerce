import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { artworksAPI } from '../services/api';
import { formatCurrency } from '../utils';

const HomePage: React.FC = () => {
  const cardBg = 'white';

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featured-artworks'],
    queryFn: () => artworksAPI.getFeatured(6),
  });

  const featuredArtworks = featuredData?.featuredArtworks || [];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-r, brand.400, brand.600)"
        color="white"
        py={20}
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            gap={8}
          >
            <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
              <Badge colorScheme="green" mb={4} fontSize="sm" px={3} py={1}>
                Demo Mode - No Login Required
              </Badge>
              <Heading
                as="h1"
                size="2xl"
                mb={4}
                bgGradient="linear(to-r, white, yellow.200)"
                bgClip="text"
              >
                Discover Extraordinary Art
              </Heading>
              <Text fontSize="xl" mb={8} opacity={0.9}>
                Explore our curated collection of masterpieces from talented artists around the world. 
                Find the perfect piece to transform your space.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} gap={4} justify={{ base: 'center', md: 'flex-start' }}>
                <Button
                  as={RouterLink}
                  to="/artworks"
                  size="lg"
                  colorScheme="white"
                  variant="solid"
                  bg="white"
                  color="brand.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Browse Artworks
                </Button>
                <Button
                  as={RouterLink}
                  to="/artists"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: 'white', color: 'brand.600' }}
                >
                  Meet Artists
                </Button>
              </Stack>
            </Box>
            <Box flex="1" maxW="500px">
              <Image
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop"
                alt="Beautiful artwork"
                borderRadius="lg"
                boxShadow="xl"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Featured Artworks Section */}
      <Box py={16}>
        <Container maxW="container.xl">
          <Box textAlign="center" mb={12}>
            <Heading as="h2" size="xl" mb={4}>
              Featured Artworks
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
              Discover our handpicked selection of exceptional artworks from talented artists
            </Text>
          </Box>

          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
              {[...Array(6)].map((_, i) => (
                <Card key={i} bg={cardBg} _dark={{ bg: 'gray.800' }}>
                  <CardBody>
                    <Box h="200px" bg="gray.200" borderRadius="md" mb={4} />
                    <Text h="20px" bg="gray.200" borderRadius="md" mb={2} />
                    <Text h="16px" bg="gray.200" borderRadius="md" w="60%" />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
              {featuredArtworks.map((artwork) => (
                <Card key={artwork._id} bg={cardBg} _dark={{ bg: 'gray.800' }} overflow="hidden" _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}>
                  <Image
                    src={artwork.primaryImage || artwork.images[0]?.url}
                    alt={artwork.title}
                    h="250px"
                    objectFit="cover"
                  />
                  <CardBody>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="start">
                        <Heading size="md" noOfLines={2}>
                          {artwork.title}
                        </Heading>
                        <Badge colorScheme="brand" variant="subtle">
                          {artwork.category}
                        </Badge>
                      </Flex>
                      <Text color="gray.600" noOfLines={2}>
                        by {artwork.artist.name}
                      </Text>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="lg" fontWeight="bold" color="brand.600">
                          {formatCurrency(artwork.price)}
                        </Text>
                        <Button
                          as={RouterLink}
                          to={`/artworks/${artwork._id}`}
                          size="sm"
                          colorScheme="brand"
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}

          <Box textAlign="center" mt={12}>
            <Button
              as={RouterLink}
              to="/artworks"
              size="lg"
              colorScheme="brand"
            >
              View All Artworks
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box bg={'gray.50'} _dark={{ bg: 'gray.800' }} py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} textAlign="center">
            <Box>
              <Heading size="xl" color="brand.600" mb={2}>
                500+
              </Heading>
              <Text color="gray.600">Artworks</Text>
            </Box>
            <Box>
              <Heading size="xl" color="brand.600" mb={2}>
                100+
              </Heading>
              <Text color="gray.600">Artists</Text>
            </Box>
            <Box>
              <Heading size="xl" color="brand.600" mb={2}>
                1000+
              </Heading>
              <Text color="gray.600">Happy Customers</Text>
            </Box>
            <Box>
              <Heading size="xl" color="brand.600" mb={2}>
                50+
              </Heading>
              <Text color="gray.600">Countries</Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={16}>
        <Container maxW="container.md" textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Ready to Start Your Art Collection?
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8}>
            Join thousands of art lovers who have found their perfect pieces in our gallery.
            Start exploring today and discover the artwork that speaks to you.
          </Text>
          <Stack direction={{ base: 'column', sm: 'row' }} gap={4} justify="center">
            <Button
              as={RouterLink}
              to="/artworks"
              size="lg"
              colorScheme="brand"
            >
              Browse Collection
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              variant="outline"
            >
              Create Account
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
