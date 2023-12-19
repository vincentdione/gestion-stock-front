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
import { Utilisateur } from './utilisateur';


export interface Entreprise { 
    id?: number;
    nom?: string;
    description?: string;
    codeFiscal?: string;
    siteWeb?: string;
    adresse?: Adresse;
    email?: string;
    numTel?: string;
    utilisateurs?: Array<Utilisateur>;
}

