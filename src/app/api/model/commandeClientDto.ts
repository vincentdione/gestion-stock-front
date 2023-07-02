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
import { ClientDto } from './clientDto';
import { LigneCommandeClientDto } from './ligneCommandeClientDto';
import { ModePayementDto } from './modePayementDto';


export interface CommandeClientDto { 
    id?: number;
    code?: string;
    dateCommande?: string;
    clientDto?: ClientDto;
    etat?: CommandeClientDto.EtatEnum;
    modePayement?: ModePayementDto;
    ligneCommandeClients?: Array<LigneCommandeClientDto>;
    commandeLivree?: boolean;
}
export namespace CommandeClientDto {
    export type EtatEnum = 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
    export const EtatEnum = {
        EnPreparation: 'EN_PREPARATION' as EtatEnum,
        Validee: 'VALIDEE' as EtatEnum,
        Livree: 'LIVREE' as EtatEnum
    };
}


