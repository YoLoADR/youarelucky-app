'use client';

// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Link from '@/components/link/Link';
import { Image } from '@/components/image/Image';
// Assets
import error from '/public/img/others/error.png';

function NotFound() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  return (
    <Flex direction="column" align="center" pt={{ sm: '125px', lg: '75px' }}>
      <Image
        src={error}
        w="400px"
        maxW="90%"
        width={400}
        height={250}
        mt={{ base: '4vh', lg: '20vh' }}
        mb="10px"
        alt=""
      />
      <Text
        color={textColor}
        fontSize={{ base: '40px', lg: '46px' }}
        fontWeight="700"
        mb="30px"
        textAlign={{ base: 'center', md: 'start' }}
      >
        Ah, dang. We didn't find that page.
      </Text>
      <Flex align="center" direction={{ base: 'column', md: 'row' }}>
        <Text
          color={textColor}
          fontWeight="500"
          fontSize={{ base: 'md', md: 'lg' }}
          me="4px"
        >
          Maybe it’s best you start back at our home page...
        </Text>
        <Link fontSize="md" fontWeight="500" color={brandColor} href="/">
          Return at home here.
        </Link>
      </Flex>
    </Flex>
  );
}

export default NotFound;
