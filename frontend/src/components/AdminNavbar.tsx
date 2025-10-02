import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavLink = ({ children, to, isActive }: { children: React.ReactNode; to: string; isActive?: boolean }) => (
  <RouterLink to={to}>
    <Box
      px={2}
      py={1}
      rounded={'md'}
      bg={isActive ? 'brand.600' : 'transparent'}
      color={isActive ? 'white' : 'inherit'}
      _hover={{
        textDecoration: 'none',
        bg: 'brand.700',
        color: 'white',
      }}
      fontWeight={isActive ? 'semibold' : 'normal'}
    >
      {children}
    </Box>
  </RouterLink>
);

const AdminNavbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isUserMenuOpen, onOpen: onUserMenuOpen, onClose: onUserMenuClose } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Manage Artworks', href: '/admin/artworks' },
    { name: 'Manage Artists', href: '/admin/artists' },
    { name: 'Manage Orders', href: '/admin/orders' },
  ];

  return (
    <Box bg={'white'} _dark={{ bg: 'gray.900' }} px={4} boxShadow="md">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        {/* Mobile Menu Toggle */}
        <IconButton
          size={'md'}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        >
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </IconButton>

        {/* Logo + Links */}
        <HStack gap={8} alignItems={'center'}>
          <Box>
            <RouterLink to="/admin">
              <Text fontSize="xl" fontWeight="bold" color="brand.600">
                Admin Panel
              </Text>
            </RouterLink>
          </Box>
          <HStack as={'nav'} gap={4} display={{ base: 'none', md: 'flex' }}>
            {adminLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                isActive={location.pathname === link.href}
              >
                {link.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>

        {/* User Menu */}
        <Flex alignItems={'center'} gap={4}>
          <Box position="relative">
            <Button
              rounded={'full'}
              variant={'ghost'}
              cursor={'pointer'}
              minW={0}
              onClick={onUserMenuOpen}
            >
              <Text fontSize="sm" fontWeight="medium">
                {user?.name}
              </Text>
            </Button>
            {isUserMenuOpen && (
              <Box
                position="absolute"
                top="100%"
                right={0}
                mt={2}
                bg="white"
                _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
                borderRadius="md"
                boxShadow="lg"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="gray.200"
                zIndex={1000}
                minW="200px"
              >
                <VStack align="stretch" gap={0} p={2}>
                  {/* Quick links for admin */}
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate('/admin');
                      onUserMenuClose();
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate('/admin/artworks');
                      onUserMenuClose();
                    }}
                  >
                    Manage Artworks
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate('/admin/artists');
                      onUserMenuClose();
                    }}
                  >
                    Manage Artists
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate('/admin/orders');
                      onUserMenuClose();
                    }}
                  >
                    Manage Orders
                  </Button>

                  <Divider />
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    color="red.500"
                    onClick={() => {
                      handleLogout();
                      onUserMenuClose();
                    }}
                  >
                    Logout
                  </Button>
                </VStack>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} gap={4}>
            {adminLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                isActive={location.pathname === link.href}
              >
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default AdminNavbar;
