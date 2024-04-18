import { Injectable } from '@angular/core';
import {Models, TelephonyProvidersEdgeApi} from "purecloud-platform-client-v2";

export interface ICustomSite {
  id: string;
  name: string;
  primarySites: Models.DomainEntityRef[];
  selfUri: string;
}


@Injectable()
export class SitesApiService {

  apiInstance = new TelephonyProvidersEdgeApi();
  sitesMap: { [key: string]: ICustomSite} = {};

  constructor() { }

  /*
    The getSiteByLogicalName() will look up a site based on its logical name from GenesysCloud from Genesys Cloud
*/
  async getSiteByLogicalName(logicalName: string) {
    const opts = {
      name: logicalName,
    };

    try {
      const sites = await this.apiInstance.getTelephonyProvidersEdgesSites(opts);

      if (sites != null && sites.entities && sites.entities.length > 0) {
        const site = {
          id: sites.entities[0].id!,
          name: sites.entities[0].name!,
          primarySites: sites.entities[0].primarySites!,
          selfUri: sites.entities[0].selfUri!
        };

        this.sitesMap[site.name] = site;
        return { ...site };
      }

      return null;
    } catch (err) {
      console.error(`Error while retrieving site with name: ${logicalName}.`, err);
      return null;
    }
  };

  async getSiteByName(siteName: string) {
    if (!(siteName in this.sitesMap)) { await this.getSiteByLogicalName(siteName) }
    return { ...this.sitesMap[siteName] };
  };


}
