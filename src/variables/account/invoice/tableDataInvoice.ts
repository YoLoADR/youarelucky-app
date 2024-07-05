type RowObj = {
  plan: string;
  date: string | Date | Date;
  amount: string | number;
};

const tableDataInvoice: RowObj[] = [
  {
    plan: 'Expert+ Plan',
    date: '09 May, 2023',
    amount: '$39.00',
  },
  {
    plan: 'Expert+ Plan',
    date: '09 Apr, 2023',
    amount: '$39.00',
  },
  {
    plan: 'Basic Plan',
    date: '09 Mar, 2023',
    amount: '$39.00',
  },
];

export default tableDataInvoice;
