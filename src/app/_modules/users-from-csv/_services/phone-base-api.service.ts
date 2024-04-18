import { Injectable } from '@angular/core';
import {Models, TelephonyProvidersEdgeApi} from 'purecloud-platform-client-v2';

export interface ICustomPhoneBase {
  id: string;
  name: string;
  lines: Models.Line[];
  selfUri: string;
}

@Injectable()
export class PhoneBaseApiService {

  apiInstance = new TelephonyProvidersEdgeApi();
  phoneBasesMap: { [key: string]: ICustomPhoneBase} = {};

  constructor() { }

  /*
    The getPhoneBaseByLogicalName() will look up a phonebase based on its logical name from GenesysCloud
  */
  private async getPhoneBaseByLogicalName(logicalName: string) {
    let opts = {
      name: logicalName,
    };

    try {
      const phoneBases = await this.apiInstance.getTelephonyProvidersEdgesPhonebasesettings(opts);

      if (phoneBases != null && phoneBases.entities && phoneBases.entities.length > 0) {
        const phoneBase = {
          id: phoneBases.entities[0].id!,
          name: phoneBases.entities[0].name!,
          lines: phoneBases.entities[0].lines!,
          selfUri: phoneBases.entities[0].selfUri!
        };

        this.phoneBasesMap[phoneBase.name] = phoneBase;
        return { ...phoneBase };
      }

      return null;
    } catch (e) {
      console.error(`Error while retrieving phonebase with name: ${logicalName}`, e);
      return null;
    }
  };

  async getPhoneBaseByName(phoneBaseName: string) {
    if (!(phoneBaseName in this.phoneBasesMap)) { await this.getPhoneBaseByLogicalName(phoneBaseName); }
    return { ...this.phoneBasesMap[phoneBaseName] }
  };

}
