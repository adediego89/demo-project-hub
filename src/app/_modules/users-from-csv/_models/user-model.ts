import {Models} from "purecloud-platform-client-v2";
import {ICustomSite} from "../_services/sites-api.service";
import {ICustomPhoneBase} from "../_services/phone-base-api.service";

export class UserModel {
  id: string;
  name: string;
  email: string;
  group?: Models.Group;
  role?: Models.DomainOrganizationRole;
  site?: ICustomSite;
  phoneBase?: ICustomPhoneBase;

  constructor(user: Models.User) {
    this.id = user.id!;
    this.name = user.name!;
    this.email = user.email!;
  }
}
