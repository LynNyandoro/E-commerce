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
  HStack,
  VStack,
  Spinner,
  Center,
  Badge,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artworksAPI } from '../../services/api';
import { formatCurrency, getCategoryDisplayName } from '../../utils';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import ArtworkModal from '../../components/admin/ArtworkModal';

const ArtworkManagementPage: React.FC = () => {
  const cardBg = 'white';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-artworks', filters],
    queryFn: () => artworksAPI.getAll(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => artworksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      toast({
        title: 'Artwork deleted',
        description: 'The artwork has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.response?.data?.message || 'Failed to delete artwork',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const artworks = data?.artworks || [];

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
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h1" size="xl">
            Manage Artworks
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={() => {
              setSelectedArtwork(null);
              onOpen();
            }}
          >
            Add New Artwork
          </Button>
        </Flex>

        {isLoading ? (
          <Center py={12}>
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : artworks.length === 0 ? (
          <Center py={12}>
            <VStack gap={4}>
              <Text fontSize="lg" color="gray.600">
                No artworks found.
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="brand"
                onClick={onOpen}
              >
                Add First Artwork
              </Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
            {artworks.map((artwork) => (
              <Card key={artwork._id} bg={cardBg} _dark={{ bg: 'gray.800' }} overflow="hidden">
                <Image
                  src={artwork.primaryImage || artwork.images[0]?.url}
                  alt={artwork.title}
                  h="200px"
                  objectFit="cover"
                />
                <CardBody>
                  <Stack gap={3}>
                    <Flex justify="space-between" align="start">
                      <Heading size="sm" noOfLines={2} flex="1">
                        {artwork.title}
                      </Heading>
                      <Badge colorScheme="brand" variant="subtle" fontSize="xs" ml={2}>
                        {getCategoryDisplayName(artwork.category)}
                      </Badge>
                    </Flex>

                    <Text color="gray.600" fontSize="sm">
                      by {artwork.artist.name}
                    </Text>

                    <VStack gap={2} align="stretch">
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Price:</Text>
                        <Text fontWeight="bold" color="brand.600">
                          {formatCurrency(artwork.price)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Views:</Text>
                        <Text>{artwork.views}</Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Status:</Text>
                        <Badge
                          colorScheme={artwork.isAvailable ? 'green' : 'red'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {artwork.isAvailable ? 'Available' : 'Sold'}
                        </Badge>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Featured:</Text>
                        <Badge
                          colorScheme={artwork.isFeatured ? 'purple' : 'gray'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {artwork.isFeatured ? 'Yes' : 'No'}
                        </Badge>
                      </Flex>
                    </VStack>

                    <HStack gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<EditIcon />}
                        flex="1"
                        onClick={() => {
                          setSelectedArtwork(artwork);
                          onOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        aria-label="Delete artwork"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(artwork._id, artwork.title)}
                        isLoading={deleteMutation.isPending}
                      />
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        <ArtworkModal
          isOpen={isOpen}
          onClose={onClose}
          artwork={selectedArtwork}
        />
      </Container>
    </Box>
  );
};

export default ArtworkManagementPage;
