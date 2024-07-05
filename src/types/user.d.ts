export interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  id?: number;
  isMfaEnabled?: boolean;
  issuer?: string;
  publicAddress?: string;
  recoveryFactors?:[];
  stripeLink?: string;
  stripeId?: string;
  uid: string;
  providerData: any;
  loggedIn?: boolean;
  userName?: string;
  role?: string;
  created_at?: string;
  picture?: string;
  phone?: string; // Ajout du numéro de téléphone
  company?: {
      name: string; // Nom de l'entreprise
      fiscal_number: string; // Numéro fiscal
      street: string; // Rue
      postal_code: string; // Code postal
      city: string; // Ville
      country: string; // Pays
      type: string; // Type d'entreprise
    };
  subscriptions?: any[];
}