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
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { artistsAPI } from '../../services/api';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist?: any; // For editing existing artist
}

const ArtistModal: React.FC<ArtistModalProps> = ({ isOpen, onClose, artist }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!artist;

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    avatar: '',
    nationality: '',
    birthYear: '',
    deathYear: '',
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => artistsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast({
        title: 'Artist created',
        description: 'The artist has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'Failed to create artist',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => artistsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast({
        title: 'Artist updated',
        description: 'The artist has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update artist',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        bio: artist.bio || '',
        email: artist.email || '',
        phone: artist.phone || '',
        website: artist.website || '',
        avatar: artist.avatar || '',
        nationality: artist.nationality || '',
        birthYear: artist.birthYear || '',
        deathYear: artist.deathYear || '',
        isActive: artist.isActive !== false,
      });
    } else {
      setFormData({
        name: '',
        bio: '',
        email: '',
        phone: '',
        website: '',
        avatar: '',
        nationality: '',
        birthYear: '',
        deathYear: '',
        isActive: true,
      });
    }
  }, [artist, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      deathYear: formData.deathYear ? parseInt(formData.deathYear) : undefined,
    };

    if (isEditing) {
      updateMutation.mutate({ id: artist._id, data: submitData });
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? 'Edit Artist' : 'Add New Artist'}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack gap={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter artist name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Enter artist biography"
                  rows={4}
                />
              </FormControl>

              <HStack gap={4} width="100%">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="artist@example.com"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.artist-website.com"
                />
              </FormControl>

              <HStack gap={4} width="100%">
                <FormControl>
                  <FormLabel>Nationality</FormLabel>
                  <Input
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="e.g., American, French, Japanese"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Avatar URL</FormLabel>
                  <Input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </FormControl>
              </HStack>

              <HStack gap={4} width="100%">
                <FormControl>
                  <FormLabel>Birth Year</FormLabel>
                  <Input
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => handleInputChange('birthYear', e.target.value)}
                    placeholder="1990"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Death Year (if applicable)</FormLabel>
                  <Input
                    type="number"
                    value={formData.deathYear}
                    onChange={(e) => handleInputChange('deathYear', e.target.value)}
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
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
              {isEditing ? 'Update Artist' : 'Create Artist'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ArtistModal;
