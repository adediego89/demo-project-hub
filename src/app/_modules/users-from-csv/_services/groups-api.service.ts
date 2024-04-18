import { Injectable } from '@angular/core';
import {GroupsApi, Models} from "purecloud-platform-client-v2";
import { retry } from '@lifeomic/attempt';

@Injectable()
export class GroupsApiService {

  apiInstance = new GroupsApi();
  groupsMap: { [key: string]: Models.Group } = {};

  constructor() { }

  /*
      The getGroup() function will make a call to the platformClient.getGroups() call passing in target page number.
  */
  async getGroup(pageNum: number) {
    const opts = {
      pageSize: 100,
      pageNumber: pageNum,
    };

    try {
      return await this.apiInstance.getGroups(opts);
    } catch (e) {
      console.log(`Error while retrieving group for page number: ${pageNum}: ${JSON.stringify(e, null, 4)}`);
      return null;
    }
  }

  /*
    The getGroups() call is going to retrieve all the groups within the org and then map the logical name (e.g. the human-readable name) to the Genesys Cloud Group GUID.  Later when we have to
    add a user to a group we are going to look up the Genesys Cloud GUID for the group by is logical name.  Note:  You have to be aware of whether the API call might expect to return the results using
    pagination and code accordingly to.  In the code below, I paginate over each page, looking up the values for all pages.  I flatten the results into 1 big list and then build a map containing just the logical
    name for the group and the GUID.
  */
  async getGroups() {
    let groups = [];

    let i = 1;
    let pageCount = 0;
    do {
      const group = await this.getGroup(i);

      if (group != null) {
        pageCount = group.pageCount!;
        groups.push(group.entities);
      }

      i++;
    }
    while (i <= pageCount);

    groups
      .flat(1)
      .filter((value) => value != null)
      .forEach((value) => { this.groupsMap[value!.name] = value!; });

    //Cloning the internal representation to keep the data immutable
    return { ...this.groupsMap };
  }

  async getGroupByName(groupName: string) {
    if (this.groupsMap[groupName] == null) {
      await this.getGroups();
    }
    return { ...this.groupsMap[groupName] };
  }


  /*
     Adds a user to a group.  Note: I am using retry logic on this call because we can have multiple users (remember we are asynchronous)
     and GenesysCloud uses an optimistic lock scheme to protect from multiple threads updating the same record at the same time.
     So, if we get any kind of error on our calls, we will retry 5 times with an exponential back off on the calls
  */
  async addUsersToAGroup(groupId: string, userIds: string[]) {


    /*If we need to retry we always need to reread the groupVersion for the record*/
    try {
      await retry(
        async () => {
          const groupVersion = (await this.apiInstance.getGroup(groupId)).version;
          await this.apiInstance.postGroupMembers(groupId, {
            memberIds: userIds,
            version: groupVersion!,
          });
        },

        /* We are doing a retry here not so much because we are afraid of rate-limiting, but because the groups api
           exposes a version field.  If we get an error we are going to assume it is a versioning error and re-read the
           group version and try to resubmit the error.
        */
        { delay: 200, factor: 2, maxAttempts: 5 }
      );
    } catch (e) {
      console.error(`Error occurred while trying create group for user.`, groupId, userIds, e);
    }
  }

  /* Return a list of Group Ids*/
  getGroupIds() {
    return Object.values(this.groupsMap).map(value => value.id!)
  };


}
