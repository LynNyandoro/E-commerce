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
  Badge,
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
import { artworksAPI } from '../services/api';
import { formatCurrency, getCategoryDisplayName, categoryOptions } from '../utils';

const ArtworksPage: React.FC = () => {
  const cardBg = 'white';
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['artworks', filters],
    queryFn: () => artworksAPI.getAll({
      ...filters,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    }),
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

  const artworks = data?.artworks || [];
  const pagination = data?.pagination;

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Text color="red.500">Error loading artworks. Please try again.</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <Heading as="h1" size="xl" mb={8}>
          Artworks
        </Heading>

        {/* Filters */}
        <Box mb={8} p={6} bg={cardBg} _dark={{ bg: 'gray.800' }} borderRadius="lg" boxShadow="sm">
          <VStack gap={4} align="stretch">
            <HStack gap={4} wrap="wrap">
              <Box flex="1" minW="200px">
                <Input
                  placeholder="Search artworks..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Box>
              <Select
                placeholder="All Categories"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                minW="150px"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
                }}
                minW="150px"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="price-asc">Price Low to High</option>
                <option value="price-desc">Price High to Low</option>
                <option value="views-desc">Most Viewed</option>
                <option value="likes-desc">Most Liked</option>
              </Select>
            </HStack>
            
            <HStack gap={4}>
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                minW="120px"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                minW="120px"
              />
            </HStack>
          </VStack>
        </Box>

        {/* Results Count */}
        {pagination && (
          <Text mb={4} color="gray.600">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} artworks
          </Text>
        )}

        {/* Artworks Grid */}
        {isLoading ? (
          <Center py={12}>
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : artworks.length === 0 ? (
          <Center py={12}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="gray.600">
                No artworks found matching your criteria.
              </Text>
              <Button
                onClick={() => setFilters({
                  page: 1,
                  limit: 12,
                  category: '',
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
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
              {artworks.map((artwork) => (
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
                        <Heading size="md" noOfLines={2} flex="1">
                          {artwork.title}
                        </Heading>
                        <Badge colorScheme="brand" variant="subtle" ml={2}>
                          {getCategoryDisplayName(artwork.category)}
                        </Badge>
                      </Flex>
                      
                      <Text color="gray.600" fontSize="sm">
                        by {artwork.artist.name}
                      </Text>
                      
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {artwork.description}
                      </Text>
                      
                      <Flex justify="space-between" align="center">
                        <VStack align="start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold" color="brand.600">
                            {formatCurrency(artwork.price)}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {artwork.formattedDimensions}
                          </Text>
                        </VStack>
                        <Button
                          as={RouterLink}
                          to={`/artworks/${artwork._id}`}
                          size="sm"
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

export default ArtworksPage;
