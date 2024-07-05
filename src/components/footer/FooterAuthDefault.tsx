'use client';
/*eslint-disable*/

import {
  Flex,
  List,
  ListItem,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  let textColor = useColorModeValue('gray.500', 'white');
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: 'column',
        lg: 'row',
      }}
      alignItems="center"
      justifyContent="space-between"
      px={{ base: '30px', md: '0px' }}
      pb="30px"
    >
      <List display="flex">
        <ListItem
          me={{
            base: '10px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            isExternal
            href="https://youarelucky.ai"
          >
            Terms & Conditions
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '10px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            isExternal
            href="https://youarelucky.ai"
          >
            Privacy Policy
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '10px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            isExternal
            href="https://youarelucky.ai"
          >
            License
          </Link>
        </ListItem>
        <ListItem>
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            isExternal
            href="https://youarelucky.ai"
          >
            Refund Policy
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
