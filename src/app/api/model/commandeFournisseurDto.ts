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
import { LigneCommandeFournisseurDto } from './ligneCommandeFournisseurDto';
import { FournisseurDto } from './fournisseurDto';


export interface CommandeFournisseurDto { 
    id?: number;
    code?: string;
    dateCommande?: string;
    fournisseurDto?: FournisseurDto;
    etatCommande?: CommandeFournisseurDto.EtatCommandeEnum;
    idEntreprise?: number;
    ligneCommandeFournisseurDtos?: Array<LigneCommandeFournisseurDto>;
    commandeLivree?: boolean;
}
export namespace CommandeFournisseurDto {
    export type EtatCommandeEnum = 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
    export const EtatCommandeEnum = {
        EnPreparation: 'EN_PREPARATION' as EtatCommandeEnum,
        Validee: 'VALIDEE' as EtatCommandeEnum,
        Livree: 'LIVREE' as EtatCommandeEnum
    };
}


