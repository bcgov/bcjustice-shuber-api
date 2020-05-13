export interface User {
    id?: string;
    siteminderId?: string;
    userAuthId?: string;
    displayName?: string;
    defaultLocationId?: string;
    systemAccountInd?: number;
    sheriffId?: string;
    sheriff?: Sheriff;
    effectiveDate?: string;
    expiryDate?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
    userRoles?: Array<UserRole>;
}
export interface Sheriff {
    id?: string;
    firstName?: string;
    lastName?: string;
    badgeNo?: string;
    imageUrl?: string;
    homeLocationId?: string;
    currentLocationId?: string;
    rankCode?: string;
    alias?: string;
    genderCode?: string;
    user?: User;
}
export interface FrontendScope {
    id?: string;
    scopeName?: string;
    scopeCode?: string;
    systemScopeInd?: boolean;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface RoleFrontendScope {
    id?: string;
    roleId?: string;
    scopeId?: string;
    scope?: FrontendScope;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface ApiScope {
    id?: string;
    scopeName?: string;
    scopeCode?: string;
    systemScopeInd?: boolean;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface RoleApiScope {
    id?: string;
    roleId?: string;
    scopeId?: string;
    scope?: ApiScope;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface Role {
    id?: string;
    roleName?: string;
    roleCode?: string;
    systemCodeInd?: number;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
    roleFrontendScopes?: Array<RoleFrontendScope>;
    roleApiScopes?: Array<RoleApiScope>;
}
export interface UserRole {
    id?: string;
    userId?: string;
    roleId?: string;
    role?: Role;
    effectiveDate?: string;
    expiryDate?: string;
    locationId?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface RolePermission {
    id?: string;
    roleId?: string;
    roleApiScopeId?: string;
    roleApiScope?: RoleApiScope;
    roleFrontendScopeId?: string;
    roleFrontendScope?: RoleFrontendScope;
    apiScopePermissionId?: string;
    frontendScopePermissionId?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface FrontendScopePermission {
    id?: string;
    frontendScopeId?: string;
    frontendScopeCode?: string;
    permissionCode?: string;
    displayName?: string;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface FrontendScopeApi {
    id?: string;
    frontendScopeId?: string;
    frontendScope?: FrontendScope;
    frontendScopeCode?: string;
    apiScopeId?: string;
    apiScope?: ApiScope;
    apiScopeCode?: string;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface DutyRecurrence {
    id?: string;
    startTime?: string;
    endTime?: string;
    daysBitmap?: number;
    sheriffsRequired?: number;
    assignmentId?: string;
}
export interface Assignment {
    id?: string;
    title?: string;
    workSectionId?: string;
    locationId?: string;
    courtroomId?: string;
    courtRoleId?: string;
    escortRunId?: string;
    jailRoleCode?: string;
    otherAssignCode?: string;
    dutyRecurrences?: Array<DutyRecurrence>;
    startDateTime?: string;
    endDateTime?: string;
}
export interface Region {
    id?: string;
    code?: string;
    name?: string;
    location?: any;
}
export interface Location {
    id?: string;
    code?: string;
    name?: string;
    parentLocationId?: string;
    regionId?: string;
}
export interface Courtroom {
    id?: string;
    locationId?: string;
    code?: string;
    name?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface JailRoleCode {
    id?: string;
    locationId?: string;
    code?: string;
    name?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface OtherAssignCode {
    id?: string;
    locationId?: string;
    code?: string;
    name?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface WorkSectionCode {
    code?: string;
    description?: string;
    expiryDate?: string;
}
export interface SheriffRankCode {
    code?: string;
    description?: string;
    expiryDate?: string;
    order?: number;
}
export interface EscortRun {
    id?: string;
    locationId?: string;
    title?: string;
    code?: string;
    name?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface Shift {
    id?: string;
    workSectionId?: string;
    locationId?: string;
    sheriffId?: string;
    startDateTime?: string;
    endDateTime?: string;
    assignmentId?: string;
}
export interface MultipleShiftUpdateRequest {
    shiftIds?: Array<string>;
    sheriffId?: string;
    startTime?: string;
    endTime?: string;
    workSectionId?: string;
    assignmentId?: string;
}
export interface ShiftCopyOptions {
    shouldIncludeSheriffs?: boolean;
    startOfWeekSource?: string;
    startOfWeekDestination?: string;
    locationId?: string;
}
export interface SheriffDuty {
    id?: string;
    sheriffId?: string;
    dutyId?: string;
    startDateTime?: string;
    endDateTime?: string;
}
export interface Duty {
    id?: string;
    startDateTime?: string;
    endDateTime?: string;
    assignmentId?: string;
    dutyRecurrenceId?: string;
    sheriffDuties?: Array<SheriffDuty>;
    comments?: string;
}
export interface DutyImportDefaultsRequest {
    locationId?: string;
    date?: string;
}
export interface SheriffDutyAutoAssignRequest {
    locationId?: string;
    date?: string;
}
export interface SheriffLocation {
    id?: string;
    sheriffId?: string;
    locationId?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    isPartial?: number;
}
export interface Leave {
    id?: string;
    sheriffId?: string;
    leaveCode?: string;
    leaveSubCode?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    isPartial?: number;
    comment?: string;
    cancelDate?: string;
    cancelReasonCode?: string;
}
export interface LeaveCancelReasonCode {
    code?: string;
    description?: string;
    expiryDate?: string;
}
export interface LeaveCode {
    code?: string;
    subCode?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface LeaveSubCode {
    code?: string;
    subCode?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface CourtRoleCode {
    id?: string;
    locationId?: string;
    code?: string;
    name?: string;
    description?: string;
    effectiveDate?: string;
    expiryDate?: string;
    sortOrder?: number;
    createdBy?: string;
    updatedBy?: string;
    createdDtm?: string;
    updatedDtm?: string;
    revisionCount?: number;
}
export interface GenderCode {
    code?: string;
    description?: string;
    expiryDate?: string;
}
