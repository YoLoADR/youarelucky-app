import { Box, Text, Badge, Heading, Image, Button } from '@chakra-ui/react';

interface CardProps {
  logo: string; // Modifier pour accepter une chaîne représentant l'URL de l'image
  name: string;
  lastInvoiceDate: string;
  amount: string;
  status: any;
}

const Card: React.FC<CardProps> = ({ logo, name, lastInvoiceDate, amount, status }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Box display="flex" alignItems="center">
        <Image src={logo} boxSize="50px" alt={`Logo of ${name}`} /> {/* Utiliser Image de Chakra UI */}
        <Heading fontSize="xl" ml={2}>{name}</Heading>
      </Box>
      <Text mt={4}>Last invoice: {lastInvoiceDate}</Text>
      <Text>Amount: {amount}</Text>
      <Badge colorScheme={status === 'Evaluating' ? 'red' : 'green'}>{status}</Badge>
      <Box display="flex" mt={3}>
        <Button
            size='md'
            height='48px'
            width='200px'
            border='2px'
            bgGradient='linear(to-r, purple.400, purple.500)'
            color='white'
            _hover={{
            bgGradient: 'linear(to-r, purple.500, purple.600)',
            boxShadow: '0 0 2px 2px #efdfde',
            }}
        >
            Purchase
        </Button>
      </Box>
    </Box>
  );
};

export default Card;
