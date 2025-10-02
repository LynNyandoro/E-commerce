import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <Box
      bg={'gray.50'}
      _dark={{ bg: 'gray.900', color: 'gray.200' }}
      color={'gray.700'}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Stack direction={'row'} gap={6}>
            <Link href={'#'}>Home</Link>
            <Link href={'#'}>About</Link>
            <Link href={'#'}>Artworks</Link>
            <Link href={'#'}>Artists</Link>
            <Link href={'#'}>Contact</Link>
          </Stack>
          <Stack direction={'row'} gap={6}>
            <Link href={'#'}>
              <Icon as={FaInstagram} w={5} h={5} />
            </Link>
            <Link href={'#'}>
              <Icon as={FaTwitter} w={5} h={5} />
            </Link>
            <Link href={'#'}>
              <Icon as={FaFacebook} w={5} h={5} />
            </Link>
          </Stack>
        </Flex>
        <Box pt={8}>
          <Text textAlign={'center'} fontSize={'sm'}>
            © 2025 Art Gallery. All rights reserved. Made with ❤️ for art lovers.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
