'use client';
// Chakra imports
import { Button } from '@chakra-ui/react';
import Card from '@/components/card/Card';

export default function Settings() {
  return (
    <Card
      flexDirection={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="right"
    >
      <Button
        variant="red"
        py="20px"
        px="16px"
        fontSize="sm"
        borderRadius="45px"
        w={{ base: '100%', md: '210px' }}
        h="54px"
      >
        Delete Account
      </Button>
      <Button
        variant="primary"
        py="20px"
        px="16px"
        fontSize="sm"
        borderRadius="45px"
        mt={{ base: '20px', md: '0px' }}
        w={{ base: '100%', md: '210px' }}
        h="54px"
      >
        Save Changes
      </Button>
    </Card>
  );
}
