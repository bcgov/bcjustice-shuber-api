import { AutoWired } from 'typescript-ioc';
import { PostgresInsert } from 'squel';

import { CurrentUser } from '../infrastructure/CurrentUser';
import { EffectiveQueryOptions } from '../infrastructure/ExpirableDatabaseService';
import { EffectiveSheriffLocationService } from './EffectiveSheriffLocationService';

import { SheriffLocation } from '../models/SheriffLocation';

@AutoWired
export class SheriffLocationService extends EffectiveSheriffLocationService<SheriffLocation> {
    fieldMap = {
        sheriff_location_id: 'id',
        sheriff_id: 'sheriffId',
        location_id: 'locationId',
        start_date: 'startDate',
        end_date: 'endDate',
        start_time: 'startTime',
        end_time: 'endTime',    
        partial_day_ind: 'isPartial',
        created_by: 'createdBy',
        updated_by: 'updatedBy',
        created_dtm: 'createdDtm',
        updated_dtm: 'updatedDtm',
        revision_count: 'revisionCount'
    };

    protected effectiveField = 'start_date';
    protected expiryField = 'end_date';

    constructor() {
        super('sheriff_location', 'sheriff_location_id');
    }

    // TODO: Not sure if filtering by lcoation ID is necessary
    async getAll(locationId?: string) {
        const query = super.getSelectQuery();

        query.where(this.getActiveWhereClause());

        const rows = await this.executeQuery<SheriffLocation>(query.toString());
        return rows;
    }

    async getBySheriffId(sheriffId: string, options?: EffectiveQueryOptions): Promise<SheriffLocation[]> {
        const query = super.getSelectQuery();

        query.where(`sheriff_id='${sheriffId}'`);
        query.where(this.getEffectiveWhereClause());

        const rows = await this.executeQuery<SheriffLocation>(query.toString());
        return rows;
    }

    protected getInsertQuery(entity: Partial<SheriffLocation>): PostgresInsert {
        // Take the Field Map keys and map properties from the object
        // const createdByPropName = this.fieldMap[this.createdByField];
        // const createdByPropValue = entity[createdByPropName];
        // const updatedByPropName = this.fieldMap[this.updatedByField];
        // const updatedByPropValue = entity[createdByPropName];

        const { displayName } = this.currentUser() as CurrentUser;

        const createdByPropName = this.fieldMap[this.createdByField];
        entity[createdByPropName] = displayName;
        const updatedByPropName = this.fieldMap[this.updatedByField];
        entity[updatedByPropName] = displayName;

        const createdDtm = new Date().toISOString();
        const createdDtmPropName = this.fieldMap[this.createdDtmField];
        entity[createdDtmPropName] = createdDtm;
        const updatedDtmPropName = this.fieldMap[this.updatedDtmField];
        entity[updatedDtmPropName] = createdDtm;
        const revisionCountPropName = this.fieldMap[this.revisionCountField];
        entity[revisionCountPropName] = 0;

        const query = this.db.insertQuery(this.tableName, this.primaryKey)
            .returning(this.getReturningFields());

        this.setQueryFields(query, entity);

        // Take the Field Map keys and map properties from the object
        const objectPropName = this.fieldMap[this.effectiveField];
        const propValue = entity[objectPropName];

        if (!propValue) {
            // If the effective date field was not provided
            // Set it to NOW
            query.set(this.effectiveField, this.squel.str('NOW()'));
        }
        
        return query;
    }
}
