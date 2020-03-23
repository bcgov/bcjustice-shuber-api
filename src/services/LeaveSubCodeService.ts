import { AutoWired } from 'typescript-ioc';
import ExpirableDatabaseService, { EffectiveQueryOptions } from '../infrastructure/ExpirableDatabaseService';
import { LeaveSubCode } from '../models/LeaveSubCode';
import { PostgresInsert } from 'squel';

@AutoWired
export class LeaveSubCodeService extends ExpirableDatabaseService<LeaveSubCode> {
    fieldMap = {
        leave_code: 'code',
        leave_sub_code: 'subCode',
        description: 'description',
        effective_date: 'effectiveDate',
        expiry_date: 'expiryDate',
        sort_order: 'sortOrder',
        created_by: 'createdBy',
        updated_by: 'updatedBy',
        created_dtm: 'createdDtm',
        updated_dtm: 'updatedDtm',
        revision_count: 'revisionCount'
    };

    constructor() {
        super('leave_sub_code', 'leave_sub_code');
    }

    async getAll(options?: EffectiveQueryOptions): Promise<LeaveSubCode[]> {
        const query = super.getEffectiveSelectQuery(options);
    
        const rows = await this.executeQuery<LeaveSubCode>(query.toString());
        return rows;    
    }

    protected getInsertQuery(entity: Partial<LeaveSubCode>): PostgresInsert {
        const query = this.db.insertQuery(this.tableName) // Ignore the PK, we don't use a UUID here
            .returning(this.getReturningFields());
        this.setQueryFields(query, entity, true);

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