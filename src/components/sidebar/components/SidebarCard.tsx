// Chakra imports
import { Box, Flex, Text, Progress } from '@chakra-ui/react';
import BarChart from '@/components/charts/BarChart';
import {
  barChartDataSidebar,
  barChartOptionsSidebar,
} from '@/variables/charts';
export default function SidebarDocs() {
  const bgColor = 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)';

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="16px"
      position="relative"
      w="100%"
      pb="10px"
    >
      <Flex direction="column" mb="12px" w="100%" px="20px" pt="20px">
        <Text fontSize="sm" fontWeight={'600'} color="white" mb="10px">
          Credits
        </Text>
        {/* Sur 100% de vos crédits */}
        <Progress
          mb="6px"
          value={90}
          colorScheme="white"
          style={{
            fill: 'white',
            background: 'rgba(255, 255, 255, 0.3)',
            width: '100%',
            height: '6px',
          }}
        />
        <Text fontWeight={'500'} fontSize="sm" color="white" mb="14px">
          3264/100,000 credits used
        </Text>
      </Flex>
      {/* @ts-ignore */}
      <Box h="160px" w="100%" mt="-46px">
        <BarChart
          chartData={barChartDataSidebar}
          chartOptions={barChartOptionsSidebar}
        />
      </Box>
    </Flex>
  );
}
