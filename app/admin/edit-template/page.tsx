'use client';
/*eslint-disable*/

import Card from '@/components/card/Card';
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import TagsField from '@/components/fields/TagsField';

export default function NewTemplate() {
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Card
      maxW="100%"
      w="716px"
      mt={{ base: '70px', md: '0px', xl: '0px' }}
      h="100%"
      mx="auto"
    >
      <FormLabel
        display="flex"
        htmlFor={'Emoji'}
        fontSize="md"
        color={textColor}
        letterSpacing="0px"
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        Emoji
      </FormLabel>
      <Input
        color={textColor}
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        h="60px"
        w="60px"
        id="Emoji"
        fontSize="24px"
        fontWeight="500"
        placeholder="😁"
        maxLength={5}
        _placeholder={placeholderColor}
        _focus={{ borderColor: 'none' }}
        mb="22px"
        defaultValue={'📝'}
      />
      <FormLabel
        display="flex"
        htmlFor={'title'}
        fontSize="md"
        color={textColor}
        letterSpacing="0px"
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        Title
      </FormLabel>
      <Input
        color={textColor}
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        h="60px"
        w="100%"
        id="title"
        fontSize="sm"
        fontWeight="500"
        defaultValue={'Write an Essay'}
        placeholder="Template Title"
        _placeholder={placeholderColor}
        _focus={{ borderColor: 'none' }}
        mb="22px"
      />
      <FormLabel
        display="flex"
        htmlFor={'description'}
        fontSize="md"
        color={textColor}
        letterSpacing="0px"
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        Description
      </FormLabel>
      <Input
        color={textColor}
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        h="60px"
        w="100%"
        id="description"
        fontSize="sm"
        fontWeight="500"
        defaultValue={
          'Generate an Essay based on a type, subject and number of paragraphs.'
        }
        placeholder="Template Description"
        _placeholder={placeholderColor}
        _focus={{ borderColor: 'none' }}
        mb="22px"
      />
      <FormLabel
        display="flex"
        htmlFor={'prompt'}
        fontSize="md"
        color={textColor}
        letterSpacing="0px"
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        Prompt
      </FormLabel>
      <Textarea
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        p="15px 20px"
        mb="28px"
        minH="180px"
        fontWeight="500"
        fontSize="sm"
        _focus={{ borderColor: 'none' }}
        color={textColor}
        defaultValue={'Write a formal essay based on the following:'}
        placeholder="Template Prompt"
        _placeholder={placeholderColor}
      />
      <TagsField label="Fields" mb="60px" />
      <Flex
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
          w={{ base: '100%', md: '200px' }}
          h="54px"
        >
          Delete Prompt
        </Button>
        <Button
          variant="primary"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          mt={{ base: '20px', md: '0px' }}
          w={{ base: '100%', md: '200px' }}
          h="54px"
        >
          Save changes
        </Button>
      </Flex>
    </Card>
  );
}
0;
