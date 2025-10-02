import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { artworksAPI, artistsAPI } from '../../services/api';

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork?: any; // For editing existing artwork
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ isOpen, onClose, artwork }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!artwork;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'painting',
    price: 0,
    dimensions: {
      width: 0,
      height: 0,
    },
    year: new Date().getFullYear(),
    medium: '',
    artist: '',
    imageUrl: '',
    isAvailable: true,
    isFeatured: false,
  });

  // Fetch artists for the select dropdown
  const { data: artistsData } = useQuery({
    queryKey: ['artists-list'],
    queryFn: () => artistsAPI.getAll({ page: 1, limit: 100 }),
    enabled: isOpen, // Only fetch when modal is open
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => artworksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      toast({
        title: 'Artwork created',
        description: 'The artwork has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'Failed to create artwork',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => artworksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      toast({
        title: 'Artwork updated',
        description: 'The artwork has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update artwork',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        description: artwork.description || '',
        category: artwork.category || 'painting',
        price: artwork.price || 0,
        dimensions: {
          width: artwork.dimensions?.width || 0,
          height: artwork.dimensions?.height || 0,
        },
        year: artwork.year || new Date().getFullYear(),
        medium: artwork.medium || '',
        artist: artwork.artist?._id || '',
        imageUrl: artwork.imageUrl || '',
        isAvailable: artwork.isAvailable !== false,
        isFeatured: artwork.isFeatured || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'painting',
        price: 0,
        dimensions: { width: 0, height: 0 },
        year: new Date().getFullYear(),
        medium: '',
        artist: '',
        imageUrl: '',
        isAvailable: true,
        isFeatured: false,
      });
    }
  }, [artwork, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      dimensions: {
        width: formData.dimensions.width,
        height: formData.dimensions.height,
      },
    };

    if (isEditing) {
      updateMutation.mutate({ id: artwork._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value,
      },
    }));
  };

  const artists = artistsData?.artists || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack gap={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter artwork title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter artwork description"
                  rows={3}
                />
              </FormControl>

              <HStack gap={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="digital">Digital</option>
                    <option value="photography">Photography</option>
                    <option value="drawing">Drawing</option>
                    <option value="mixed-media">Mixed Media</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Artist</FormLabel>
                  <Select
                    value={formData.artist}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    placeholder="Select artist"
                  >
                    {artists.map((artist: any) => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <HStack gap={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>Price ($)</FormLabel>
                  <NumberInput
                    value={formData.price}
                    onChange={(valueString, valueNumber) => handleInputChange('price', valueNumber)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <NumberInput
                    value={formData.year}
                    onChange={(valueString, valueNumber) => handleInputChange('year', valueNumber)}
                    min={1900}
                    max={new Date().getFullYear()}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack gap={4} width="100%">
                <FormControl>
                  <FormLabel>Width (cm)</FormLabel>
                  <NumberInput
                    value={formData.dimensions.width}
                    onChange={(valueString, valueNumber) => handleDimensionChange('width', valueNumber)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Height (cm)</FormLabel>
                  <NumberInput
                    value={formData.dimensions.height}
                    onChange={(valueString, valueNumber) => handleDimensionChange('height', valueNumber)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Medium</FormLabel>
                <Input
                  value={formData.medium}
                  onChange={(e) => handleInputChange('medium', e.target.value)}
                  placeholder="e.g., Oil on canvas, Bronze, Digital"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="Enter image URL"
                />
              </FormControl>

              <HStack gap={6} width="100%">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Available for Sale</FormLabel>
                  <Switch
                    isChecked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Featured</FormLabel>
                  <Switch
                    isChecked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? 'Update Artwork' : 'Create Artwork'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ArtworkModal;
