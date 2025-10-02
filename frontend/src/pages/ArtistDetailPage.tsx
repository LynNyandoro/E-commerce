import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Stack,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
  Badge,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { artistsAPI } from '../services/api';
import { formatCurrency, getCategoryDisplayName } from '../utils';
import { ChevronRightIcon } from '@chakra-ui/icons';

const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cardBg = 'white';

  const { data, isLoading, error } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => artistsAPI.getById(id!, { artworkPage: 1, artworkLimit: 6 }),
    enabled: !!id,
  });

  const artist = data?.artist;
  const artworks = data?.artworks || [];
  const artworkPagination = data?.artworkPagination;

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box>Loading...</Box>
      </Container>
    );
  }

  if (error || !artist) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Text color="red.500">Artist not found.</Text>
          <Button as={RouterLink} to="/artists" colorScheme="brand">
            Browse Artists
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
            <BreadcrumbLink as={RouterLink} to="/artists">
              Artists
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>{artist.name}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={12}>
          {/* Artist Info */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
                <CardBody>
                  <VStack spacing={4} align="center" textAlign="center">
                    <Image
                      src={artist.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artist.name) + '&size=200&background=f7fafc&color=4a5568'}
                      alt={artist.name}
                      boxSize="200px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                    
                    <VStack spacing={2}>
                      <Heading as="h1" size="xl">
                        {artist.name}
                      </Heading>
                      
                      {artist.website && (
                        <Button
                          as="a"
                          href={artist.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          variant="outline"
                        >
                          Visit Website
                        </Button>
                      )}
                    </VStack>

                     <Divider />

                    <VStack spacing={3} align="stretch" w="full">
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Total Artworks:</Text>
                        <Text color="brand.600">{artist.artworkCount || 0}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Total Sales:</Text>
                        <Text color="brand.600">{artist.totalSales}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Total Revenue:</Text>
                        <Text color="brand.600">{formatCurrency(artist.totalRevenue)}</Text>
                      </Flex>
                    </VStack>

                    {/* Social Media */}
                    {(artist.socialMedia.instagram || artist.socialMedia.twitter || artist.socialMedia.facebook) && (
                      <>
                        <Divider />
                        <VStack spacing={2}>
                          <Text fontWeight="medium">Follow Artist</Text>
                          <HStack spacing={3}>
                            {artist.socialMedia.instagram && (
                              <Button
                                as="a"
                                href={artist.socialMedia.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="sm"
                                variant="outline"
                                colorScheme="pink"
                              >
                                Instagram
                              </Button>
                            )}
                            {artist.socialMedia.twitter && (
                              <Button
                                as="a"
                                href={artist.socialMedia.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                              >
                                Twitter
                              </Button>
                            )}
                            {artist.socialMedia.facebook && (
                              <Button
                                as="a"
                                href={artist.socialMedia.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                              >
                                Facebook
                              </Button>
                            )}
                          </HStack>
                        </VStack>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Artist Bio and Artworks */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Bio */}
              <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Heading size="md">About the Artist</Heading>
                    <Text color="gray.700" lineHeight="1.6" whiteSpace="pre-wrap">
                      {artist.bio}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Artworks */}
              <Box>
                <HStack justify="space-between" align="center" mb={6}>
                  <Heading size="md">
                    Artworks by {artist.name}
                  </Heading>
                  <Button
                    as={RouterLink}
                    to="/artworks"
                    size="sm"
                    variant="outline"
                  >
                    View All
                  </Button>
                </HStack>

                {artworks.length === 0 ? (
                  <Card bg={cardBg} _dark={{ bg: 'gray.800' }}>
                    <CardBody>
                      <VStack spacing={4} py={8}>
                        <Text color="gray.600">
                          No artworks available from this artist yet.
                        </Text>
                        <Button
                          as={RouterLink}
                          to="/artworks"
                          colorScheme="brand"
                          variant="outline"
                        >
                          Browse All Artworks
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {artworks.map((artwork) => (
                        <Card key={artwork._id} bg={cardBg} _dark={{ bg: 'gray.800' }} overflow="hidden" _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}>
                          <Image
                            src={artwork.primaryImage || artwork.images[0]?.url}
                            alt={artwork.title}
                            h="200px"
                            objectFit="cover"
                          />
                          <CardBody>
                            <Stack spacing={3}>
                              <Flex justify="space-between" align="start">
                                <Heading size="sm" noOfLines={2} flex="1">
                                  {artwork.title}
                                </Heading>
                                <Badge colorScheme="brand" variant="subtle" ml={2} fontSize="xs">
                                  {getCategoryDisplayName(artwork.category)}
                                </Badge>
                              </Flex>
                              
                              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                                {artwork.description}
                              </Text>
                              
                              <Flex justify="space-between" align="center">
                                <Text fontSize="md" fontWeight="bold" color="brand.600">
                                  {formatCurrency(artwork.price)}
                                </Text>
                                <Button
                                  as={RouterLink}
                                  to={`/artworks/${artwork._id}`}
                                  size="xs"
                                  colorScheme="brand"
                                  variant="outline"
                                >
                                  View
                                </Button>
                              </Flex>
                            </Stack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>

                    {artworkPagination && artworkPagination.totalPages > 1 && (
                      <Flex justify="center" mt={8}>
                        <Button
                          as={RouterLink}
                          to="/artworks"
                          variant="outline"
                        >
                          View All Artworks
                        </Button>
                      </Flex>
                    )}
                  </>
                )}
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArtistDetailPage;
