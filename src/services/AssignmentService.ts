import { Assignment } from '../models/Assignment';
import { DutyRecurrence } from '../models/DutyRecurrence';
import ExpirableDatabaseService, { EffectiveQueryOptions } from '../infrastructure/ExpirableDatabaseService';
import { DutyRecurrenceService } from './DutyRecurrenceService';
import moment from 'moment';
import { ValidateError, FieldErrors } from 'tsoa';
import { ClientBase } from 'pg';
import { CourtroomService } from './CourtroomService';
import { JailRoleCodeService } from './JailRoleCodeService';
import { EscortRunService } from './EscortRunService';
import { OtherAssignCodeService } from './OtherAssignCodeService';
import { CourtRoleCodeService } from './CourtRoleCodeService';
import { AutoWired, Inject, Container } from 'typescript-ioc';

@AutoWired
export class AssignmentService extends ExpirableDatabaseService<Assignment> {

    @Inject
    private dutyRecurrenceService!: DutyRecurrenceService;

    fieldMap = {
        assignment_id: 'id',
        title: 'title',
        location_id: 'locationId',
        courtroom_id: 'courtroomId',
        court_role_id: 'courtRoleId',
        jail_role_id: 'jailRoleId',
        other_assign_id: 'otherAssignId',
        escort_run_id: 'escortRunId',
        court_role_code: 'courtRoleCode', // TODO: Phase these out? They don't need to be here any more, we're using IDs
        jail_role_code: 'jailRoleCode', // TODO: Phase these out? They don't need to be here any more, we're using IDs
        other_assign_code: 'otherAssignCode', // TODO: Phase these out? They don't need to be here any more, we're using IDs
        work_section_code: 'workSectionId',
        effective_date: 'startDateTime',
        expiry_date: 'endDateTime'
    };

    constructor() {
        super('assignment', 'assignment_id');
    }

    async getById(id: string) {
        const dutyRecurrences = this.dutyRecurrenceService.getAllForAssignment(id, { includeExpired: true });
        const assignment = await super.getById(id);
        if (assignment) {
            assignment.dutyRecurrences = await dutyRecurrences
        }
        return assignment;
    }

    async getAll(locationId?: string, options?: EffectiveQueryOptions): Promise<Assignment[]> {
        const query = super.getEffectiveSelectQuery(options);

        if (locationId) {
            query.where(`location_id='${locationId}'`);
        };
        const assignments = await this.executeQuery<Assignment>(query.toString());
        const assignmentIds = assignments.map(a => a.id) as string[];
        const dutyRecurrences = await this.dutyRecurrenceService.getAllForAssignments(assignmentIds, options);
        return assignments.map(assignment => (
            {
                ...assignment,
                dutyRecurrences: dutyRecurrences.filter(dr => dr.assignmentId === assignment.id)
            }
        ))
    }

    async update(entity: Partial<Assignment>): Promise<Assignment> {
        const title = await this.getAssignmentTitle(entity);
        const query = this.getUpdateQuery({
            ...entity,
            title
        });
        let updatedAssignment: Assignment = undefined as any;
        const { dutyRecurrences = [] } = entity;
        return await this.db.transaction(async ({ client, getService }) => {
            // Setup the dutyRecurrenceService for transaction
            const dutyRecurrenceService = getService<DutyRecurrenceService>(DutyRecurrenceService);

            // Update the Assignment
            const { rows } = await client.query(query.toString());
            updatedAssignment = rows[0];

            const dutyRecurrencesWithAssignmentId = dutyRecurrences.map(dr => ({
                ...dr,
                assignmentId: entity.id
            }));
            // Create new duty recurrences, adding on assignmentId
            const createPromises = dutyRecurrencesWithAssignmentId
                .filter(dr => dr.id == undefined)
                .map(dr => dutyRecurrenceService.create(dr));

            // Update existing duty recurrences
            const updatePromises = dutyRecurrencesWithAssignmentId
                .filter(dr => dr.id != undefined)
                .map(dr => dutyRecurrenceService.update(dr));
            const allDutyRecurrences = await Promise.all(createPromises.concat(updatePromises));
            updatedAssignment.dutyRecurrences = allDutyRecurrences;
            return updatedAssignment;
        });
    }

    private validateAssignment(entity: Partial<Assignment>) {
        if (entity.workSectionId === "COURTS") {
            if (entity.courtroomId == undefined && entity.courtRoleId == undefined) {
                throw new ValidateError({
                    'model.courtroomId': {
                        message: "Courtroom or Court Role must be set for Court assignments"
                    }
                }, "Invalid Court Assignment")
            }
        } else if (entity.workSectionId === "JAIL") {
            if (entity.jailRoleId == undefined) {
                throw new ValidateError({
                    'model.jailRoleId': {
                        message: "Jail Role must be set for Jail assignments"
                    }
                }, "Invalid Jail Assignment")
            }
        } else if (entity.workSectionId === "OTHER") {
            if (entity.otherAssignId == undefined) {
                throw new ValidateError({
                    'model.otherAssignId': {
                        message: "Assignment Type must be set for Other assignments"
                    }
                }, "Invalid Other Assignment")
            }
        } else if (entity.workSectionId === "ESCORTS") {
            if (entity.escortRunId == undefined) {
                throw new ValidateError({
                    'model.escortRunId': {
                        message: "Escort Run must be set for Escort assignments"
                    }
                }, "Invalid Escort Assignment")
            }
        }
    }

    private async getAssignmentTitle(entity: Partial<Assignment>): Promise<string> {
        let title = entity.title;
        if (entity.workSectionId === "COURTS") {
            if (entity.courtroomId) {
                const service = Container.get(CourtroomService) as CourtroomService;
                const courtroom = await service.getById(entity.courtroomId as string);
                if (courtroom) {
                    title = courtroom.code;
                }
            } else {
                const service = Container.get(CourtRoleCodeService) as CourtRoleCodeService;
                const courtRole = await service.getById(entity.courtRoleId as string);
                if (courtRole) {
                    title = courtRole.description;
                }
            }
        } else if (entity.workSectionId === "JAIL") {
            const service = Container.get(JailRoleCodeService) as JailRoleCodeService;
            const code = await service.getById(entity.jailRoleCode as string);
            if (code) {
                title = code.description;
            }
        } else if (entity.workSectionId === "ESCORTS") {
            const service = Container.get(EscortRunService) as EscortRunService;
            const run = await service.getById(entity.escortRunId as string);
            if (run) {
                title = run.title;
            }
        } else if (entity.workSectionId === "OTHER") {
            const service = Container.get(OtherAssignCodeService) as OtherAssignCodeService;
            const code = await service.getById(entity.otherAssignCode as string);
            if (code) {
                title = code.description;
            }
        }
        return title as string;
    }

    async create(entity: Partial<Assignment>): Promise<Assignment> {
        this.validateAssignment(entity);
        const { dutyRecurrences = [] } = entity;
        const title = await this.getAssignmentTitle(entity);
        const query = this.getInsertQuery({
            ...entity,
            title   
        });
        return await this.db.transaction(async ({ client, getService }) => {
            const dutyRecurrenceService = getService<DutyRecurrenceService>(DutyRecurrenceService);
            const { rows } = await client.query(query.toString());
            const createdAssignment: Assignment = rows[0];
            createdAssignment.dutyRecurrences = await Promise.all(
                dutyRecurrences.map(dr => dutyRecurrenceService.create({
                    ...dr,
                    assignmentId: createdAssignment.id
                }))
            );
            return createdAssignment;
        });
    }

    async expire(id: string, expiryDate?: string): Promise<void> {
        if (!expiryDate) {
            expiryDate = moment().toISOString();
        }
        const query = this.getExpireQuery(id, expiryDate);

        await this.db.transaction(async ({ client, getService }) => {
            const dutyRecurrenceService = getService<DutyRecurrenceService>(DutyRecurrenceService);
            const dutyRecurrences = dutyRecurrenceService.getAllForAssignment(id, { includeExpired: true });
            // Expire assignment
            await client.query(query.toString());
            const dutyRecurrenceIds = (await dutyRecurrences).map(dr => dr.id) as string[];
            // Expire Duty Recurrences
            await Promise.all(dutyRecurrenceIds.map(id => dutyRecurrenceService.expire(id)));
        });
    }

    async delete(id: string): Promise<void> {
        const delAssignmentQuery = this.getDeleteQuery(id);
        await this.db.transaction(async ({client}) => {
            const delRecurrenceQuery = this.squel.delete()
                .from(this.dutyRecurrenceService.dbTableName)
                .where(`assignment_id='${id}'`);
            await client.query(delRecurrenceQuery.toString());
            await client.query(delAssignmentQuery.toString());
        });
    }
}