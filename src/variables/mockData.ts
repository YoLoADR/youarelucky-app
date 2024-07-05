export const EXPIRED_TRIAL = 'expiredTrial';
export const ACTIVE_NO_CREDITS = 'activeNoCredits';
export const ACTIVE_WITH_CREDITS = 'activeWithCredits';
export const NEWCOMER = 'newComer';
export const IN_TRIAL = 'inTrial';

export const getMockUser = (scenario: string) => {
  switch (scenario) {
    case EXPIRED_TRIAL:
      return {
        email: "mockuser@example.com",
        displayName: "Mock User",
        phoneNumber: null,
        photoURL: null,
        uid: "mockUserId",
        providerData: [],
        subscriptions: [{
          trial_start: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // il y a 4 jours
          trial_end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // il y a 2 jours
          trial_tokens_used: 11, // Dépassé la limite de tokens d'essai (par exemple 10)
          status: 'trialing', // Statut d'essai
        }],
      };
    case ACTIVE_NO_CREDITS:
      return {
        email: "mockuser@example.com",
        displayName: "Mock User",
        phoneNumber: null,
        photoURL: null,
        uid: "mockUserId",
        providerData: [],
        subscriptions: [{
          trial_start: new Date(),
          trial_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Toujours en période d'essai
          trial_tokens_used: 101, // Dépassé la limite mensuelle de tokens (par exemple 100)
          status: 'active', // Statut actif
        }],
      };
    case ACTIVE_WITH_CREDITS:
      return {
        email: "mockuser@example.com",
        displayName: "Mock User",
        phoneNumber: null,
        photoURL: null,
        uid: "mockUserId",
        providerData: [],
        subscriptions: [{
          trial_start: new Date(),
          trial_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Toujours en période d'essai
          trial_tokens_used: 50, // Sous la limite mensuelle de tokens (par exemple 100)
          status: 'active', // Statut actif
        }],
      };
    case NEWCOMER:
      return {
        email: "mockuser@example.com",
        displayName: "Mock User",
        phoneNumber: null,
        photoURL: null,
        uid: "mockUserId",
        providerData: [],
        subscriptions: [], // Pas de souscriptions
      };
    case IN_TRIAL:
      return {
        email: "mockuser@example.com",
        displayName: "Mock User",
        phoneNumber: null,
        photoURL: null,
        uid: "mockUserId",
        providerData: [],
        subscriptions: [{
          trial_start: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // il y a 1 jour
          trial_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // dans 1 jour
          trial_tokens_used: 5, // Utilisé quelques tokens, mais sous la limite
          status: 'trialing', // Statut d'essai
        }],
      };
    default:
      return null;
  }
};
