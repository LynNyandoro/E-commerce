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
  Badge,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <RouterLink to={to}>
    <Box
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200',
        _dark: { bg: 'gray.700' },
      }}
    >
      {children}
    </Box>
  </RouterLink>
);

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isUserMenuOpen, onOpen: onUserMenuOpen, onClose: onUserMenuClose } = useDisclosure();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Links = [
    { name: 'Artworks', href: '/artworks' },
    { name: 'Artists', href: '/artists' },
  ];

  return (
    <Box bg={'white'} _dark={{ bg: 'gray.900' }} px={4} boxShadow="md">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
           onClick={isOpen ? onClose : onOpen}
        >
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </IconButton>
        <HStack gap={8} alignItems={'center'}>
          <Box>
            <RouterLink to="/">
              <Text fontSize="xl" fontWeight="bold" color="brand.600">
                Art Gallery
              </Text>
            </RouterLink>
          </Box>
          <HStack as={'nav'} gap={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} to={link.href}>
                {link.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'} gap={4}>
          <RouterLink to="/cart">
            <Button variant="ghost" size="sm" position="relative">
              Cart
              {totalItems > 0 && (
                <Badge
                  ml={2}
                  colorScheme="red"
                  variant="solid"
                  borderRadius="full"
                  fontSize="xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </RouterLink>

          {isAuthenticated ? (
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
                    {user?.role === 'admin' ? (
                      // Admin menu - only admin functions
                      <>
                        <Button
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            navigate('/admin');
                            onUserMenuClose();
                          }}
                        >
                          Admin Dashboard
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
                      </>
                    ) : (
                      // Regular user menu
                      <>
                        <Button
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            navigate('/profile');
                            onUserMenuClose();
                          }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            navigate('/orders');
                            onUserMenuClose();
                          }}
                        >
                          My Orders
                        </Button>
                      </>
                    )}
                         <Divider />
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
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
          ) : (
            <Stack direction={'row'} gap={4}>
              <RouterLink to="/login">
                <Button
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'ghost'}
                >
                  Sign In
                </Button>
              </RouterLink>
              {/* Sign Up temporarily disabled */}
            </Stack>
          )}
        </Flex>
      </Flex>

       {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} gap={4}>
            {Links.map((link) => (
              <NavLink key={link.name} to={link.href}>
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;