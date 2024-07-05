import { ComponentType, Element } from 'react';

export interface IRoute {
  path: string;
  name: string;
  layout?: string;
  exact?: boolean;
  component?: ComponentType;
  icon?: ComponentType | string | Element;
  secondary?: boolean;
  collapse?: boolean;
  items?: IRoute[];
  rightElement?: boolean;
  invisible?: boolean;
  disabled?: boolean;
  requiresPremium?: boolean; // Ajouté pour gérer l'accès aux abonnés premium
  accessibleDuringTrial?: boolean;
}
