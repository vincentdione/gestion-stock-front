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
import { ArticleDto } from './articleDto';


export interface LigneCommandeClientDto { 
    id?: number;
    article?: ArticleDto;
    quantite?: number;
    prixUnitaire?: number;
    idEntreprise?: number;
    unite?: string;
}

