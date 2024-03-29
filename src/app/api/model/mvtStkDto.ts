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


export interface MvtStkDto { 
    id?: number;
    dateMvt?: string;
    quantite?: number;
    article?: ArticleDto;
    typeMvtStk?: MvtStkDto.TypeMvtStkEnum;
    sourceMvt?: MvtStkDto.SourceMvtEnum;
    idEntreprise?: number;
    unite?: string;
}
export namespace MvtStkDto {
    export type TypeMvtStkEnum = 'ENTREE' | 'SORTIE' | 'CORRECTION_POS' | 'CORRECTION_NEG';
    export const TypeMvtStkEnum = {
        Entree: 'ENTREE' as TypeMvtStkEnum,
        Sortie: 'SORTIE' as TypeMvtStkEnum,
        CorrectionPos: 'CORRECTION_POS' as TypeMvtStkEnum,
        CorrectionNeg: 'CORRECTION_NEG' as TypeMvtStkEnum
    };
    export type SourceMvtEnum = 'COMMANDE_CLIENT' | 'COMMANDE_FOURNISSEUR' | 'VENTE';
    export const SourceMvtEnum = {
        CommandeClient: 'COMMANDE_CLIENT' as SourceMvtEnum,
        CommandeFournisseur: 'COMMANDE_FOURNISSEUR' as SourceMvtEnum,
        Vente: 'VENTE' as SourceMvtEnum
    };
}


