/* eslint-disable  @typescript-eslint/no-explicit-any */

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';

// import {GraphRequest} from '@microsoft/microsoft-graph-client'
// import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export class GroupInfoGraph {

	/**
	 * Gets all the groups the selected user is part of using MS Graph API
	 * @param context Web part context
	 * @param email Email ID of the selected user
	 */
	public static GetUserGroups = async (context: WebPartContext, email: string): Promise<any[]> =>{
		try {
			const groups: string[] = [];

			const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');
			const response = await client.api(`/users/${email}/memberOf`)
				.version('v1.0')
				.select(['groupTypes', 'displayName', 'mailEnabled', 'securityEnabled', 'description'])
				.get();

			response.value.map((item: string) => {
				groups.push(item);
			});
			// console.log('MSGraphService.GetUserGroups: ', groups);

			return Promise.resolve(groups);
		}
		catch (error) {
			console.log('MSGraphService.GetUserGroups Error: ', error);
			return Promise.reject(error);
		}
	}

	/**
	 * Gets all the members in the selected group using MS Graph API
	 * @param context Web part context
	 * @param groupId Group ID of the selected group
	 */
	public static GetGroupMembers = async (context: WebPartContext, groupId: string): Promise<any[]> =>{
		try {
			const users: string[] = [];

			const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');
			const response = await client
				.api(`/groups/${groupId}/members`)
				.version('v1.0')
				.select(['mail', 'displayName'])
				.get();

			response.value.map((item: string) => {
				users.push(item);
			});
			// console.log('MSGraphService.GetGroupMembers: ', users);

			return Promise.resolve(users);
		}
		catch (error) {
			console.log('MSGraphService.GetGroupMembers Error: ', error);
			return Promise.reject(error);
		}
	}
}
