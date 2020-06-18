import moment from 'moment';
import * as SA from 'superagent';
import saPrefix from 'superagent-prefix';
import superagentUse from 'superagent-use';
import Client from './Client';
import {
    Assignment,
    Location,
    Courtroom,
    Duty,
    DutyRecurrence,
    Region,
    EscortRun,
    Sheriff,
    Shift,
    DutyImportDefaultsRequest,
    MultipleShiftUpdateRequest,
    Leave,
    SheriffDuty,
    SheriffLocation,
    SheriffDutyAutoAssignRequest,
    User,
    Role,
    UserRole,
    ApiScope,
    RoleApiScope,
    FrontendScope,
    FrontendScopePermission,
    RoleFrontendScope,
    RolePermission
} from './models';
import { toTimeString } from '../common/TimeUtils';
import { ApiError } from '../common/Errors';
import { TokenPayload } from '../common/authentication';
import { decodeJwt } from '../common/tokenUtils';
import { DateType } from '../common/types';
import { getDateString } from '../common/dateUtils';
import { ERROR_DEPRECATED_DELETE_DUTYRECURRENCE, ERROR_DEPRECATED_DELETE_ASSIGNMENT } from '../common/Messages';
import { OtherAssignCode } from '../models/OtherAssignCode';
import { JailRoleCode } from '../models/JailRoleCode';
import { CourtRoleCode } from '../models/CourtRoleCode';

export type SuperAgentRequestInterceptor = (req: SA.SuperAgentRequest) => SA.SuperAgentRequest

export default class ExtendedClient extends Client {

    private _requestInterceptor?: SuperAgentRequestInterceptor;
    private timezoneOffset?: number;

    constructor(baseUrl: string) {
        super(
            superagentUse(SA.agent())
                .use(saPrefix(baseUrl))
        );
        (this.agent as any).use((req) => this.interceptRequest(req))
        this.errorProcessor = this.processError;
        this.timezoneOffset = -(new Date().getTimezoneOffset() / 60);
    }

    private interceptRequest(req: SA.SuperAgentRequest) {
        req.set('Accept', 'application/javascript');
        req.set('TZ-Offset', `${this.timezoneOffset}`);

        // SITEMINDER does not allow DELETE methods through, so here we use
        // a POST with the X-HTTP-METHOD-OVERRIDE
        if (req.method === 'DELETE') {
            req.method = 'POST';
            req.set('X-HTTP-METHOD-OVERRIDE', 'DELETE');
        }
        return this._requestInterceptor ? this._requestInterceptor(req) : req;
    }

    set requestInterceptor(interceptor: SuperAgentRequestInterceptor | undefined) {
        this._requestInterceptor = interceptor;
    }

    get requestInterceptor(): SuperAgentRequestInterceptor | undefined {
        return this._requestInterceptor;
    }

    protected handleResponse<T>(response: SA.Response) {
        return super.handleResponse<T>(response);
    }

    protected processError(err): Error {
        let apiError = new ApiError(err);
        return apiError;
    }

    private async nullOn404<T>(method: () => Promise<T>): Promise<T> {
        try {
            return await method();
        } catch (err) {
            if (err.status === 404) {
                return undefined as any;
            } else {
                throw err;
            }
        }
    }

    async GetRegionById(id: string): Promise<Region> {
        return await this.nullOn404(() => super.GetRegionById(id));
    }

    async GetLocationById(id: string): Promise<Location> {
        return await this.nullOn404(
            () => super.GetLocationById(id)
        );
    }

    async GetSheriffById(id: string): Promise<Sheriff> {
        return await this.nullOn404(
            () => super.GetSheriffById(id)
        );
    }

    GetSheriffs(locationId: string = "", startDate?: DateType, endDate?: DateType): Promise<Sheriff[]> {
        const startMoment = moment(startDate);
        const endMoment = endDate ? moment(endDate) : moment(startMoment);
        return super.GetSheriffs(locationId, startMoment.toISOString(), endMoment.toISOString());
    }

    GetSheriffLocations(locationId: string = ""): Promise<SheriffLocation[]> {
        return super.GetSheriffLocations(locationId);
    }


    async GetCourtroomById(id: string): Promise<Courtroom> {
        return await this.nullOn404(
            () => super.GetCourtroomById(id)
        );
    }

    GetCourtrooms(locationId: string = ""): Promise<Courtroom[]> {
        return super.GetCourtrooms(locationId);
    }

    GetCourtRoleCodes(locationId: string = ""): Promise<CourtRoleCode[]> {
        return super.GetCourtRoleCodes(locationId);
    }

    GetJailRoleCodes(locationId: string = ""): Promise<JailRoleCode[]> {
        return super.GetJailRoleCodes(locationId);
    }

    GetOtherAssignCodes(locationId: string = ""): Promise<OtherAssignCode[]> {
        return super.GetOtherAssignCodes(locationId);
    }

    async GetAssignmentById(id: string): Promise<Assignment> {
        return await this.nullOn404(
            () => super.GetAssignmentById(id)
        );
    }

    GetAssignments(locationId: string = "", startDate?: DateType, endDate?: DateType): Promise<Assignment[]> {
        const startMoment = moment(startDate);
        const endMoment = endDate ? moment(endDate) : moment(startMoment);
        return super.GetAssignments(locationId, startMoment.toISOString(), endMoment.toISOString());
    }

    GetEscortRuns(locationId: string = ""): Promise<EscortRun[]> {
        return super.GetEscortRuns(locationId);
    }

    async GetEscortRunById(id: string): Promise<EscortRun> {
        return await this.nullOn404(
            () => super.GetEscortRunById(id)
        );
    }

    GetShifts(locationId: string = ""): Promise<Shift[]> {
        return super.GetShifts(locationId);
    }

    async GetShiftById(id: string): Promise<Shift> {
        return await this.nullOn404(
            () => super.GetShiftById(id)
        );
    }

    async GetDutyRecurrenceById(id: string): Promise<DutyRecurrence> {
        return await this.nullOn404(
            () => super.GetDutyRecurrenceById(id)
        );
    }

    GetDutyRecurrences(startDate?: DateType, endDate?: DateType): Promise<DutyRecurrence[]> {
        const startMoment = moment(startDate);
        const endMoment = endDate ? moment(endDate) : moment(startMoment);
        return super.GetDutyRecurrences(startMoment.toISOString(), endMoment.toISOString());
    }

    async GetDutyById(id: string): Promise<Duty> {
        return await this.nullOn404(
            () => super.GetDutyById(id)
        );
    }

    GetLeaveById(id: string): Promise<Leave> {
        return this.nullOn404(
            () => super.GetLeaveById(id)
        );
    }

    async GetSheriffDutyById(id: string): Promise<Duty> {
        return await this.nullOn404(
            () => super.GetSheriffDutyById(id)
        );
    }

    private ensureTimeZone(...dutyRecurrences: DutyRecurrence[]) {
        return dutyRecurrences.map(dr => ({
            ...dr,
            startTime: toTimeString(dr.startTime),
            endTime: toTimeString(dr.endTime)
        }));
    }

    CreateDutyRecurrence(model: DutyRecurrence) {
        return super.CreateDutyRecurrence(this.ensureTimeZone(model)[0]);
    }

    UpdateDutyRecurrence(id: string, model: DutyRecurrence) {
        return super.UpdateDutyRecurrence(id, this.ensureTimeZone(model)[0])
    }

    CreateAssignment(model: Assignment) {
        const { dutyRecurrences = [] } = model;
        return super.CreateAssignment({
            ...model,
            dutyRecurrences: this.ensureTimeZone(...dutyRecurrences)
        });
    }

    UpdateAssignment(id: string, model: Assignment) {
        const { dutyRecurrences = [] } = model;
        return super.UpdateAssignment(id, {
            ...model,
            dutyRecurrences: this.ensureTimeZone(...dutyRecurrences)
        });
    }

    private ensureLeaveTimes(model: Leave) {
        return {
            ...model,
            startTime: model.startTime ? toTimeString(model.startTime) : undefined,
            endTime: model.endTime ? toTimeString(model.endTime) : undefined
        };
    }

    CreateLeave(model: Leave) {
        return super.CreateLeave(this.ensureLeaveTimes(model));
    }

    UpdateLeave(id: string, model: Leave) {
        return super.UpdateLeave(id, this.ensureLeaveTimes(model));
    }

    UpdateMultipleShifts(model: MultipleShiftUpdateRequest) {
        const { startTime, endTime, ...rest } = model;
        const request: MultipleShiftUpdateRequest = {
            ...rest,
            startTime: startTime ? moment(startTime).format() : undefined,
            endTime: endTime ? moment(endTime).format() : undefined
        };

        return super.UpdateMultipleShifts(request);
    }

    async ImportDefaultDuties(request: DutyImportDefaultsRequest) : Promise<Duty[]> {
        const {
            locationId,
            date
        } = request;

        return await super.ImportDefaultDuties({
            locationId,
            date: getDateString(date)
        });
    }

    async AutoAssignSheriffDuties(request: SheriffDutyAutoAssignRequest) : Promise<SheriffDuty[]> {
        const {
            locationId,
            date
        } = request;
        return await super.AutoAssignSheriffDuties({
            locationId,
            date: getDateString(date)
        });
    }

    /**
     * @deprecated Please use ExpireAssignment instead.
     */
    async DeleteAssignment(id:string):Promise<void>{
        throw new Error(ERROR_DEPRECATED_DELETE_ASSIGNMENT);
    }

    /**
     * @deprecated Please use ExpireDutyRecurrence instead.
     */
    async DeleteDutyRecurrence(id:string):Promise<void>{
        throw new Error(ERROR_DEPRECATED_DELETE_DUTYRECURRENCE);
    }

    GetUsers(locationId?): Promise<User[]> {
        return super.GetUsers(locationId);
    }

    GetUsersByLocationId(locationId: string = ""): Promise<User[]> {
        return super.GetUsers(locationId);
    }

    async GetUserById(id: string): Promise<User> {
        return await this.nullOn404(
            () => super.GetSheriffById(id)
        );
    }

    GetRoles(): Promise<Role[]> {
        return super.GetRoles();
    }

    async GetRoleById(id: string): Promise<Role> {
        return await this.nullOn404(
            () => super.GetRoleById(id)
        );
    }

    async GetUserRoleById(id: string): Promise<UserRole> {
        return await this.nullOn404(
            () => super.GetUserRoleById(id)
        );
    }

    GetApiScopes(): Promise<ApiScope[]> {
        return super.GetApiScopes();
    }

    GetFrontendScopes(): Promise<FrontendScope[]> {
        return super.GetFrontendScopes();
    }

    GetFrontendScopePermissions(): Promise<FrontendScopePermission[]> {
        return super.GetFrontendScopePermissions();
    }

    GetRoleApiScopes(): Promise<RoleApiScope[]> {
        return super.GetRoleApiScopes();
    }

    GetRoleFrontendScopes(): Promise<RoleFrontendScope[]> {
        return super.GetRoleFrontendScopes();
    }

    GetRolePermissions(): Promise<RolePermission[]> {
        return super.GetRolePermissions();
    }
}
