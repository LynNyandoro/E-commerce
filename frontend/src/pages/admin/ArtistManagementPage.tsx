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
import { artistsAPI } from '../../services/api';
import { formatCurrency } from '../../utils';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import ArtistModal from '../../components/admin/ArtistModal';

const ArtistManagementPage: React.FC = () => {
  const cardBg = 'white';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-artists', filters],
    queryFn: () => artistsAPI.getAll(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => artistsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast({
        title: 'Artist deactivated',
        description: 'The artist has been successfully deactivated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Operation failed',
        description: error.response?.data?.message || 'Failed to deactivate artist',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const artists = data?.artists || [];

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
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h1" size="xl">
            Manage Artists
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={() => {
              setSelectedArtist(null);
              onOpen();
            }}
          >
            Add New Artist
          </Button>
        </Flex>

        {isLoading ? (
          <Center py={12}>
            <Spinner size="xl" color="brand.500" />
          </Center>
        ) : artists.length === 0 ? (
          <Center py={12}>
            <VStack gap={4}>
              <Text fontSize="lg" color="gray.600">
                No artists found.
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="brand"
                onClick={() => {
                  setSelectedArtist(null);
                  onOpen();
                }}
              >
                Add First Artist
              </Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
            {artists.map((artist) => (
              <Card key={artist._id} bg={cardBg} _dark={{ bg: 'gray.800' }} overflow="hidden">
                <Image
                  src={artist.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artist.name) + '&size=300&background=f7fafc&color=4a5568'}
                  alt={artist.name}
                  h="200px"
                  objectFit="cover"
                />
                <CardBody>
                  <Stack gap={3}>
                    <Heading size="md" noOfLines={1}>
                      {artist.name}
                    </Heading>

                    <Text color="gray.600" fontSize="sm" noOfLines={3}>
                      {artist.bio}
                    </Text>

                    <VStack gap={2} align="stretch">
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Artworks:</Text>
                        <Text fontWeight="bold">{artist.artworkCount || 0}</Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Total Sales:</Text>
                        <Text fontWeight="bold" color="green.600">
                          {artist.totalSales}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Revenue:</Text>
                        <Text fontWeight="bold" color="brand.600">
                          {formatCurrency(artist.totalRevenue)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.500">Status:</Text>
                        <Badge
                          colorScheme={artist.isActive ? 'green' : 'red'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {artist.isActive ? 'Active' : 'Inactive'}
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
                        setSelectedArtist(artist);
                        onOpen();
                      }}
                    >
                      Edit
                    </Button>
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        aria-label="Deactivate artist"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(artist._id, artist.name)}
                        isLoading={deleteMutation.isPending}
                        isDisabled={!artist.isActive}
                      />
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        <ArtistModal
          isOpen={isOpen}
          onClose={onClose}
          artist={selectedArtist}
        />
      </Container>
    </Box>
  );
};

export default ArtistManagementPage;
