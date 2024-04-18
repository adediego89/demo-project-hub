import { Injectable } from '@angular/core';
import {UsersApi} from "purecloud-platform-client-v2";
import {IUserFromCsv} from "../_models/user-from-csv.interface";

@Injectable()
export class UsersApiService {

  apiInstance = new UsersApi();

  constructor() { }

  async createUser(userFromCsv: IUserFromCsv) {

    const user = {
      name: userFromCsv.NAME,
      email: userFromCsv.EMAIL,
      divisionId: 'ebca71b6-8933-47b1-967d-3f5abdf24695' // TODO: Get this
    };

    try {
      return await this.apiInstance.postUsers(user);
    } catch (e) {
      console.error(`Error has occurred while trying to create user ${userFromCsv.NAME}`, e);
      return null;
    }
  };

}
