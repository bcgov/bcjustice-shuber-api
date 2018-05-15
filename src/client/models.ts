/*****************************AutoGenerated Code : Do not edit *******************************/
// Type generated from Swagger definition


    export interface DutyRecurrence  {
        id? : string
        startTime? : string
        endTime? : string
        daysBitmap? : number
        sheriffsRequired? : number
        assignmentId? : string
        effectiveDate? : string
        expiryDate? : string
    }
    export interface Assignment  {
        id? : string
        title? : string
        workSectionCode? : string
        courthouseId? : string
        courtroomId? : string
        runId? : string
        jailRoleCode? : string
        otherAssignCode? : string
        effectiveDate? : string
        expiryDate? : string
        dutyRecurrences? : Array<DutyRecurrence>
    }
    export interface Region  {
        id? : string
        code? : string
        name? : string
        location? : any
    }
    export interface Courthouse  {
        id? : string
        code? : string
        name? : string
        parentCourthouseId? : string
        regionId? : string
        addressId? : string
        location? : any
    }
    export interface Sheriff  {
        id? : string
        firstName? : string
        lastName? : string
        badgeNo? : string
        imageUrl? : string
        homeCourthouseId? : string
        rankCode? : string
        alias? : string
    }
    export interface Courtroom  {
        id? : string
        code? : string
        name? : string
        courthouseId? : string
    }
    export interface JailRoleCode  {
        code? : string
        description? : string
    }
    export interface OtherAssignCode  {
        code? : string
        description? : string
    }
    export interface WorkSectionCode  {
        code? : string
        description? : string
    }
    export interface SheriffRankCode  {
        code? : string
        description? : string
    }
    export interface Run  {
        id? : string
        title? : string
        courthouseId? : string
    }
    export interface Shift  {
        id? : string
        workSectionCode? : string
        courthouseId? : string
        sheriffId? : string
        startDateTime? : string
        endDateTime? : string
    }
    export interface Duty  {
        id? : string
        startDateTime? : string
        endDateTime? : string
        assignmentId? : string
        sheriffsRequired? : number
        dutyRecurrenceId? : string
    }