/**
 * OpenApi specification - Ousmane Vincent Dione
 * OpenApi documentation for Stock Management
 *
 * The version of the OpenAPI document: 1.0
 * Contact: dioneousmanevincent@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Adresse } from './adresse';
import { UtilisateurDto } from './utilisateurDto';
import { CommandeClientDto } from './commandeClientDto';


export interface LivraisonDto { 
    id?: number;
    code?: string;
    dateLivraison?: string;
    etat?: LivraisonDto.EtatEnum;
    commandeClient?: CommandeClientDto;
    adresse?: Adresse;
    utilisateur?: UtilisateurDto;
}
export namespace LivraisonDto {
    export type EtatEnum = 'EN_COURS' | 'LIVRER' | 'ANNULER' | 'RENVOYER';
    export const EtatEnum = {
        EnCours: 'EN_COURS' as EtatEnum,
        Livrer: 'LIVRER' as EtatEnum,
        Annuler: 'ANNULER' as EtatEnum,
        Renvoyer: 'RENVOYER' as EtatEnum
    };
}

