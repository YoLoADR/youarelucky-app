'use client'; // if you use app dir, don't forget this line
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function CostOptiChart(props: any) {
  const { chartCostOptiData, chartostOptiOptions } = props;
  return (
    <>
    <StatGroup mb={3}>
      <Stat>
        <StatLabel>Total Cost Savings</StatLabel>
        <StatNumber>$1,200,000</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          15.5% increase
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Logistics Efficiency</StatLabel>
        <StatNumber>87%</StatNumber>
        <StatHelpText>
          <StatArrow type='decrease' />
          4.7% improvement
        </StatHelpText>
      </Stat>
    </StatGroup>
      <ApexChart
        type="line"
        options={chartostOptiOptions}
        series={chartCostOptiData}
        height="350px"
      />
    </>
  );
}

