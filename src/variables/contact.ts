// data.ts
export interface Contact {
    id: number;
    name: string;
    position: string;
    imageUrl: string;
    email: string;
    phoneNumber: string;
    rating: number;
  }

 export  interface ContactsProvider {
    logo: string; // Modifier pour accepter une chaîne représentant l'URL de l'image
    name: string;
    lastInvoiceDate: string;
    amount: string;
    status: 'Paid' | 'Overdue';
  }
  
  export const contacts: Contact[] = [
    {
      id: 1,
      name: "Jane Cooper",
      position: "Risk Management Consultant",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "jane.cooper@example.com",
      phoneNumber: "+1234567890",
      rating: 5
    },
    {
      id: 2,
      name: "Cody Fisher",
      position: "Export Legal Advisor",
      imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      email: "cody.fisher@example.com",
      phoneNumber: "+1234567892",
      rating: 4.5
    },
    // Ajoutez plus de contacts selon vos besoins
  ];

  export const contactsProvider = [
    {
      logo: "https://img.logoipsum.com/290.svg",
      name: 'Tuple',
      lastInvoiceDate: 'June 13, 2024',
      amount: '$300',
      status: 'Evaluating'
    },
    {
      logo: "https://img.logoipsum.com/289.svg",
      name: 'SavvyCal',
      lastInvoiceDate: 'June 1, 2024',
      amount: '$450',
      status: 'Shortlisted'
    }
  ];
  
  
  

  