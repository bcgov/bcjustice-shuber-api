/**
 * API scopes. Scopes in this context refer to top-level routes.
 */
export interface ApiScope {
    id?: string; // GUID api_scope_id
    scopeString?:string; // TODO: Remove this from the model and DB... we use scopeCode instead?
    scopeName?:string; // Human-friendly scope name
    scopeId?:string; // Code type for the scope
    scopeCode?:string; // Code type for the scope
    systemCodeInd?: boolean; // Is the scope required by the SYSTEM
    description?:string; // Scope description
    createdBy?:string;
    updatedBy?:string;
    createdDtm?:string;
    updatedDtm?:string;
    revisionCount?:number;
}
