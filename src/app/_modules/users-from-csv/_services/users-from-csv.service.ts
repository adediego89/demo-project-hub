import { Injectable } from '@angular/core';
import {GenesysCloudService} from "../../../_services/genesys-cloud.service";
import {GroupsApiService} from "./groups-api.service";
import {RolesApiService} from "./roles-api.service";
import {PhoneBaseApiService} from "./phone-base-api.service";
import {SitesApiService} from "./sites-api.service";
import {StationsApiService} from "./stations-api.service";
import {PhoneApiService} from "./phone-api.service";
import {Models} from "purecloud-platform-client-v2";
import {IUserFromCsv} from "../_models/user-from-csv.interface";
import {UsersApiService} from "./users-api.service";
import {UserModel} from "../_models/user-model";

@Injectable()
export class UsersFromCsvService {

  constructor(
    private readonly gcSvc: GenesysCloudService,
    private readonly groupsApiSvc: GroupsApiService,
    private readonly rolesApiSvc: RolesApiService,
    private readonly phoneBaseApiSvc: PhoneBaseApiService,
    private readonly sitesApiSvc: SitesApiService,
    private readonly stationsApiSvc: StationsApiService,
    private readonly phoneApiSvc: PhoneApiService,
    private readonly usersApiSvc: UsersApiService) { }

  /**
   * Creates an indivdiual user in Genesys Cloud and then looks up additional information
   * for the user.  (e.g. group, site, role and phonebase)
   * @param userFromCsv
   */
  async createUser(userFromCsv: IUserFromCsv) {
    const createdUser = await this.usersApiSvc.createUser(userFromCsv);
    const user = new UserModel(createdUser!);

    user.group = await this.groupsApiSvc.getGroupByName(userFromCsv.GROUP);
    user.site = await this.sitesApiSvc.getSiteByName(userFromCsv.SITENAME);
    user.role = await this.rolesApiSvc.getRoleByName(userFromCsv.ROLE);
    user.phoneBase = await this.phoneBaseApiSvc.getPhoneBaseByName(userFromCsv.PHONEBASE);

    return user;
  }

  /**
   * Takes a list of users (sourced from a csv file) and assigns them to a chat group
   * @param {*} users
   */
  private async assignUsersToGroups(users: UserModel[]) {
    for (const groupId of this.groupsApiSvc.getGroupIds()) {
      const userIdsInGroup = users
        .filter((user) => groupId === user.group!.id)
        .map((user) => user.id);

      if (userIdsInGroup.length > 0) {
        try {
          await this.groupsApiSvc.addUsersToAGroup(groupId, userIdsInGroup);
        } catch (e) {
          console.error(`Error in assignUsersToGroup`, e);
        }
      }
    }
  };

  /*Takes a list of users (sourced from a csv file) and assigns them a role*/
  private async assignUsersToRoles(users: UserModel[]) {
    for (const roleId of this.rolesApiSvc.getRoleIds()) {
      const userIdsInRole = users
        .filter((user) => roleId === user.role!.id)
        .map((user) => user.id);

      if (userIdsInRole && userIdsInRole.length > 0) {
        try {
          await this.rolesApiSvc.addUsersToARole(roleId, userIdsInRole);
        } catch (e) {
          console.error(`Error in assignUsersToRoles`, users, e);
        }
      }
    }
  };

  /**
   * Takes a list of users from the createUser() function and assigns the users to a group, a role and a site.
   * @param {*} users
   */
  async postUserCreation(users: UserModel[]) {
    console.log(`Assigning users to groups`);
    await this.assignUsersToGroups(users);

    console.log(`Assigning users to roles`);
    await this.assignUsersToRoles(users);

    console.log(`Creating phones for users`);
    for (const user of users) {
      await this.phoneApiSvc.createWebRTCPhone(user);
      await this.stationsApiSvc.assignUserToWebRtcPhone(user.id!);
    }
  }


  async createUsersInGc(userFromCsv: IUserFromCsv) {

    try {
      console.log(`Creating a user`);
      const userResults = await this.createUser(userFromCsv);

      const users = [userResults];
      await this.postUserCreation(users);
    } catch (e) {
      console.error(e);
    }
  };

}
