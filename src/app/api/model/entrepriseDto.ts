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
import { UtilisateurDto } from './utilisateurDto';
import { AdresseDto } from './adresseDto';


export interface EntrepriseDto { 
    id?: number;
    nom?: string;
    description?: string;
    codeFiscal?: string;
    siteWeb?: string;
    adresseDto?: AdresseDto;
    email?: string;
    numTel?: string;
    utilisateurDtos?: Array<UtilisateurDto>;
}

