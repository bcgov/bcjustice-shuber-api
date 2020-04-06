        import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import ControllerBase from '../infrastructure/ControllerBase';
import { Security } from '../authentication';
import { Inject, AutoWired } from 'typescript-ioc';
import { UserRoleService } from '../services/UserRoleService';
import { UserRole } from '../models/UserRole';

@Route('UserRole')
@Security('jwt')
@AutoWired
export class UserRoleController extends ControllerBase<any, UserRoleService> {
    @Inject
    protected serviceInstance!: UserRoleService;

    @Get('me')
    public getCurrentUserRoles() {
        return super.getAll();
    }

    @Get()
    public getUserRoles(@Query() locationId?: string, @Query() startDate?: string, @Query() endDate?: string) {
        return this.service.getAll(undefined, { startDate, endDate });
    }

    @Get('{id}')
    public getUserRoleById(id: string) {
        return super.getById(id);
    }

    @Security('jwt', ['roles:manage'])
    @Post()
    public createUserRole(@Body() model: UserRole) {
        return super.create(model);
    }

    @Security('jwt', ['roles:manage'])
    @Post('{id}/expire')
    public expireUserRole(@Path() id:string) {
        return this.service.expire(id);
    }

    @Security('jwt', ['roles:manage'])
    @Post('{id}/unexpire')
    public unexpireUserRole(@Path() id:string) {
        return this.service.unexpire(id);
    }

    @Security('jwt', ['roles:manage'])
    @Post('/expire')
    public expireUserRoles(@Body() ids:string[]) {
        if (ids.length > 0) {
            ids.forEach(id => this.service.expire(id));
        }
    }

    @Security('jwt', ['roles:manage'])
    @Post('/unexpire')
    public unexpireUserRoles(@Body() ids:string[]) {
        if (ids.length > 0) {
            ids.forEach(id => this.service.unexpire(id));
        }
    }

    @Security('jwt', ['roles:manage'])
    @Put('{id}')
    public updateUserRole(@Path() id: string, @Body() model: UserRole) {
        return super.update(id,model);
    }

    @Security('jwt', ['roles:manage'])
    @Delete('{id}')
    public deleteUserRole(@Path() id:string) {
        return super.delete(id);
    }

    @Security('jwt', ['roles:manage'])
    @Post()
    public deleteUserRoles(@Body() ids:string[]) {
        if (ids.length > 0) {
            ids.forEach(id => super.delete(id));
        }
    }
}
