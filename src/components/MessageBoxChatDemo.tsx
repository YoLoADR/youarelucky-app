import ReactMarkdown from 'react-markdown'
import { useColorModeValue, SimpleGrid, Box} from '@chakra-ui/react'
import Card from '@/components/card/Card'
import CostOptiChart from '@/components/charts/CostOptiChart';
import TransitTimeChart from '@/components/charts/TransitTimeChart';
import { chartTransitData, chartTransitOptions, chartCostOptiData, chartostOptiOptions } from '@/variables/charts';
import ContactCard from '@/components/card/ContactCard';
import ProCard from '@/components/card/ProCard';
import { contacts, Contact, contactsProvider, ContactsProvider } from '@/variables/contact';

export default function MessageBoxDemo(props: { output: string, demoNumber: number }) {
  const { output, demoNumber } = props
  const textColor = useColorModeValue('navy.700', 'white')
  return (
    <Card
      display={output ? 'flex' : 'none'}
      px="22px !important"
      pl="22px !important"
      color={textColor}
      minH="450px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
    >
      { demoNumber == 1 && <TransitTimeChart chartData={chartTransitData} chartOptions={chartTransitOptions}/> }
      { demoNumber == 2 && <CostOptiChart chartCostOptiData={chartCostOptiData} chartostOptiOptions={chartostOptiOptions}/> }

      { demoNumber == 3 &&
        <SimpleGrid columns={2} spacing={10}>
          {contacts.map((contact: Contact) => (
              <ContactCard
                key={contact.id}
                name={contact.name}
                position={contact.position}
                imageUrl={contact.imageUrl}
                email={contact.email}
                phoneNumber={contact.phoneNumber}
                rating={contact.rating}
              />
            ))}
        </SimpleGrid>}
      { demoNumber == 4 &&
        <SimpleGrid columns={2} spacing={10}>
          {contactsProvider.map((contact, index) => (
                <ProCard key={index} 
                  logo={contact.logo} 
                  name={contact.name} 
                  lastInvoiceDate={contact.lastInvoiceDate}
                  amount={contact.amount} 
                  status={contact.status} />
            ))}
        </SimpleGrid>}
      <Box mt={5}>
        <ReactMarkdown  className="font-medium">
          {output ? output : ''}
        </ReactMarkdown>
      </Box>
    </Card>
  )
}



