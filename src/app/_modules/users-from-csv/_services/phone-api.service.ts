import { Injectable } from '@angular/core';
import {TelephonyProvidersEdgeApi} from "purecloud-platform-client-v2";
import {UserModel} from "../_models/user-model";

@Injectable()
export class PhoneApiService {

  apiInstance = new TelephonyProvidersEdgeApi();

  constructor() { }

  async createWebRTCPhone(user: UserModel) {

    const phone = {
      name: `${user.name.replace(' ', '_')}_WEBRTC_PHONE`,
      state: 'active',
      site: {
        id: user.site!.id,
        name: user.site!.name,
        selfUri: user.site!.selfUri,
      },
      phoneBaseSettings: {
        id: user.phoneBase!.id!,
        name: user.phoneBase!.name,
        selfUri: user.phoneBase!.selfUri,
      },
      lineBaseSettings: {
        id: user.phoneBase!.lines[0].id,
        name: user.phoneBase!.lines[0].name,
        selfUri: user.phoneBase!.lines[0].selfUri,
      },
      phoneMetaBase: {
        id: 'inin_webrtc_softphone.json',
        name: 'PureCloud WebRTC Phone',
      },
      lines: [
        {
          name: user.phoneBase!.lines[0].name,
          lineBaseSettings: {
            id: user.phoneBase!.lines[0].id,
            name: user.phoneBase!.lines[0].name,
            selfUri: user.phoneBase!.lines[0].selfUri,
          },
        },
      ],
      capabilities: {
        provisions: false,
        registers: false,
        dualRegisters: false,
        hardwareIdType: 'mac',
        allowReboot: false,
        noRebalance: false,
        noCloudProvisioning: false,
        mediaCodecs: ['audio/opus'],
      },
      webRtcUser: {
        id: user.id,
        name: user.name.replace(' ', '_'),
      },
    };

    try {
      return await this.apiInstance.postTelephonyProvidersEdgesPhones(phone);
    } catch (e) {
      console.error(`Error has occurred while trying to create a phone for user.`, user, phone, e);
      return null;
    }
  }

}
