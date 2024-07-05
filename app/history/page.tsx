'use client';
// Chakra imports
import { Box } from '@chakra-ui/react';
import tableDataCheck from '@/components/tables/variables/tableDataCheck';
import CheckTable from '@/components/tables/CheckTable';

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <CheckTable tableData={tableDataCheck} />
    </Box>
  );
}
