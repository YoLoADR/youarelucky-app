import { Flex, Spinner as ChakraSpinner, useColorModeValue } from '@chakra-ui/react';

const Spinner = () => {
  //const spinnerColor = useColorModeValue('blue.500', 'blue.300');
  return (
    <Flex alignItems="center" justifyContent="center" height="100vh">
      <div>Loading...</div>
    </Flex>
  );
};

export default Spinner;