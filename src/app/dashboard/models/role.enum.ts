export enum Role {
  USER = 'USER',
  LIVREUR = 'LIVREUR',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export const RoleLabel: { [key in Role]: string } = {
  [Role.USER]: 'Utilisateur',
  [Role.LIVREUR]: 'Livreur',
  [Role.ADMIN]: 'Administrateur',
  [Role.MANAGER]: 'Manager'
};
