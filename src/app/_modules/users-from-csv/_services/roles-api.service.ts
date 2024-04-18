import { Injectable } from '@angular/core';
import {AuthorizationApi, Models} from "purecloud-platform-client-v2";

@Injectable()
export class RolesApiService {

  apiInstance = new AuthorizationApi();
  rolesMap: { [key: string]: Models.DomainOrganizationRole} = {};

  constructor() { }

  /*
    The getAuthorizationRoleByLogicalName() will look up a role based on its logical name from GenesysCloud from Genesys Cloud
*/
  async getAuthorizationRoleByLogicalName(logicalName: string) {
    let opts = {
      name: logicalName,
    };

    try {
      const roles = await this.apiInstance.getAuthorizationRoles(opts);

      if (roles != null && roles.entities && roles.entities.length > 0) {
        const role = {
          id: roles.entities[0].id,
          name: roles.entities[0].name,
        };

        this.rolesMap[role.name!] = role;
        return { ...role };
      }

      return null;
    } catch (error) {
      console.log(`Error while retrieving role with name: ${logicalName}`);
      return null;
    }
  };

  /* Retrieves a role based on is role name*/
  async getRoleByName(roleName: string) {
    if (!(roleName in this.rolesMap)) { await this.getAuthorizationRoleByLogicalName(roleName); }
    return this.rolesMap[roleName];
  };

  /* Return a list of roles for all roles returned*/
  getRoleIds() {
    return Object.values(this.rolesMap).map(value => value.id!)
  };

  async addUsersToARole(roleId: string, userIds: string[]) {
    try {
      await this.apiInstance.putAuthorizationRoleUsersAdd(roleId, userIds);
    } catch (e) {
      console.error(`Error occurred while trying add users to a role.`, roleId, userIds, e);
    }
  };
}
