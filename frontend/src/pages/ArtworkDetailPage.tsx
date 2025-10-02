import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
  IconButton,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { artworksAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate, getCategoryDisplayName } from '../utils';
import { ChevronRightIcon } from '@chakra-ui/icons';

const ArtworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { addItem, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const cardBg = 'white';

  const { data, isLoading, error } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => artworksAPI.getById(id!),
    enabled: !!id,
  });

  const artwork = data?.artwork;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    if (!artwork) return;

    addItem(artwork, 1);
    toast({
      title: 'Added to cart',
      description: `${artwork.title} has been added to your cart.`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleViewArtist = () => {
    if (artwork?.artist._id) {
      navigate(`/artists/${artwork.artist._id}`);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box>Loading...</Box>
      </Container>
    );
  }

  if (error || !artwork) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Text color="red.500">Artwork not found.</Text>
          <Button as={RouterLink} to="/artworks" colorScheme="brand">
            Browse Artworks
          </Button>
        </VStack>
      </Container>
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
            <BreadcrumbLink as={RouterLink} to="/artworks">
              Artworks
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>{artwork.title}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12}>
          {/* Image Section */}
          <GridItem>
            <VStack gap={4}>
              <Image
                src={artwork.primaryImage || artwork.images[0]?.url}
                alt={artwork.title}
                borderRadius="lg"
                boxShadow="lg"
                maxH="600px"
                objectFit="contain"
              />
              
              {/* Additional Images */}
              {artwork.images.length > 1 && (
                <SimpleGrid columns={4} gap={4} w="full">
                  {artwork.images.slice(1, 5).map((image, index) => (
                    <Image
                      key={index}
                      src={image.url}
                      alt={`${artwork.title} view ${index + 2}`}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ opacity: 0.8 }}
                    />
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </GridItem>

          {/* Details Section */}
          <GridItem>
            <VStack gap={6} align="stretch">
              {/* Title and Category */}
              <Box>
                <HStack justify="space-between" align="start" mb={2}>
                  <Heading as="h1" size="xl">
                    {artwork.title}
                  </Heading>
                  <Badge colorScheme="brand" variant="subtle" fontSize="sm">
                    {getCategoryDisplayName(artwork.category)}
                  </Badge>
                </HStack>
                <Text color="gray.600" fontSize="lg">
                  by {artwork.artist.name}
                </Text>
              </Box>

              {/* Price */}
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                  {formatCurrency(artwork.price)}
                </Text>
              </Box>

              {/* Description */}
              <Box>
                <Heading size="md" mb={3}>
                  Description
                </Heading>
                <Text color="gray.700" lineHeight="1.6">
                  {artwork.description}
                </Text>
              </Box>

              {/* Details */}
              <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
                <CardBody>
                  <VStack gap={4} align="stretch">
                    <Heading size="sm">Details</Heading>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Medium</Text>
                        <Text fontWeight="medium">{artwork.medium}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Year</Text>
                        <Text fontWeight="medium">{artwork.year}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Dimensions</Text>
                        <Text fontWeight="medium">{artwork.formattedDimensions}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Availability</Text>
                        <Text fontWeight="medium" color={artwork.isAvailable ? 'green.500' : 'red.500'}>
                          {artwork.isAvailable ? 'Available' : 'Sold'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>

              {/* Tags */}
              {artwork.tags.length > 0 && (
                <Box>
                  <Heading size="sm" mb={3}>
                    Tags
                  </Heading>
                  <HStack gap={2} wrap="wrap">
                    {artwork.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" colorScheme="gray">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}

              {/* Action Buttons */}
              <VStack gap={3}>
                {artwork.isAvailable ? (
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    colorScheme="brand"
                    width="full"
                    isDisabled={isInCart(artwork._id)}
                  >
                    {isInCart(artwork._id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    colorScheme="gray"
                    width="full"
                    isDisabled
                  >
                    Sold Out
                  </Button>
                )}
                
                <Button
                  onClick={handleViewArtist}
                  size="lg"
                  variant="outline"
                  width="full"
                >
                  View Artist Profile
                </Button>
              </VStack>

               <Divider />

              {/* Artist Info */}
              <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
                <CardBody>
                  <VStack gap={3} align="stretch">
                    <Heading size="sm">About the Artist</Heading>
                    <HStack gap={4}>
                      <Image
                        src={artwork.artist.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artwork.artist.name) + '&size=60&background=f7fafc&color=4a5568'}
                        alt={artwork.artist.name}
                        boxSize="60px"
                        borderRadius="full"
                        objectFit="cover"
                      />
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">{artwork.artist.name}</Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {artwork.artist.bio}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArtworkDetailPage;
