import React, { useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Input,
  Select,
  HStack,
  VStack,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { artistsAPI } from '../services/api';
import { truncateText } from '../utils';

const ArtistsPage: React.FC = () => {
  const cardBg = 'white';
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['artists', filters],
    queryFn: () => artistsAPI.getAll(filters),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const artists = data?.artists || [];
  const pagination = data?.pagination;

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Text color="red.500">Error loading artists. Please try again.</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <Heading as="h1" size="xl" mb={8}>
          Artists
        </Heading>

        {/* Filters */}
        <Box mb={8} p={6} bg={cardBg} _dark={{ bg: 'gray.800' }} borderRadius="lg" boxShadow="sm">
          <HStack gap={4} wrap="wrap">
            <Box flex="1" minW="200px">
              <Input
                placeholder="Search artists..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Box>
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
              }}
              minW="150px"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="totalSales-desc">Most Sales</option>
              <option value="totalRevenue-desc">Highest Revenue</option>
              <option value="createdAt-desc">Newest First</option>
            </Select>
          </HStack>
        </Box>

        {/* Results Count */}
        {pagination && (
          <Text mb={4} color="gray.600">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} artists
          </Text>
        )}

        {/* Artists Grid */}
        {isLoading ? (
          <Center py={12}>
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : artists.length === 0 ? (
          <Center py={12}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="gray.600">
                No artists found matching your criteria.
              </Text>
              <Button
                onClick={() => setFilters({
                  page: 1,
                  limit: 12,
                  search: '',
                  sortBy: 'name',
                  sortOrder: 'asc',
                })}
                colorScheme="brand"
                variant="outline"
              >
                Clear Filters
              </Button>
            </VStack>
          </Center>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
              {artists.map((artist) => (
                <Card key={artist._id} bg={cardBg} _dark={{ bg: 'gray.800' }} overflow="hidden" _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}>
                  <Image
                    src={artist.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artist.name) + '&size=300&background=f7fafc&color=4a5568'}
                    alt={artist.name}
                    h="250px"
                    objectFit="cover"
                  />
                  <CardBody>
                    <Stack gap={3}>
                      <Heading size="md" noOfLines={1}>
                        {artist.name}
                      </Heading>
                      
                      <Text color="gray.600" fontSize="sm" noOfLines={3}>
                        {truncateText(artist.bio, 120)}
                      </Text>
                      
                      <VStack gap={2} align="stretch">
                        <Flex justify="space-between" fontSize="sm" color="gray.500">
                          <Text>Artworks:</Text>
                          <Text fontWeight="medium">{artist.artworkCount || 0}</Text>
                        </Flex>
                        <Flex justify="space-between" fontSize="sm" color="gray.500">
                          <Text>Sales:</Text>
                          <Text fontWeight="medium">{artist.totalSales}</Text>
                        </Flex>
                      </VStack>
                      
                      <Button
                        as={RouterLink}
                        to={`/artists/${artist._id}`}
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                        width="full"
                      >
                        View Profile
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Flex justify="center" mt={12} gap={2}>
                <Button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  isDisabled={!pagination.hasPrev}
                  variant="outline"
                >
                  Previous
                </Button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = pagination.currentPage;
                    return page === 1 || page === pagination.totalPages || 
                           (page >= current - 2 && page <= current + 2);
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <Text px={2}>...</Text>}
                        <Button
                          onClick={() => handlePageChange(page)}
                          colorScheme={page === pagination.currentPage ? 'brand' : 'gray'}
                          variant={page === pagination.currentPage ? 'solid' : 'outline'}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}
                
                <Button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  isDisabled={!pagination.hasNext}
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ArtistsPage;
