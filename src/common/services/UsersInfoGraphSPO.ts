/* eslint-disable  @typescript-eslint/no-explicit-any */

import { GraphError } from '@microsoft/microsoft-graph-client';

import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from '@microsoft/sp-webpart-base';

import '@pnp/graph/members';
import "@pnp/graph/groups";
import { IGroups } from '@pnp/graph/groups/types';
import "@pnp/graph/users";

import "@pnp/sp/profiles";
import { ISiteGroupInfo } from '@pnp/sp/site-groups/types';
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users";
import { ISiteUserInfo } from '@pnp/sp/site-users/types';

import { UserGroup } from '../types/CommonEnums';
import { getGraph, getSP } from '../utils/PnpSetup';
import { GroupInfoGraph } from './GroupInfoGraph';


export class UsersInfoGraphSPO {

	/**
	 * Get informations from the logged in user
	 */
	public static getCurrentUser = async (): Promise<ISiteUserInfo> => {
		try {
			const spFI = getSP();
			const curUser: ISiteUserInfo = await spFI.web.currentUser();
			// console.log('curUser:', curUser);

			return Promise.resolve(curUser);
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 *
	 * @param empLogin
	 * @returns
	 */
	public static getUserSharePoint = async (empLogin: string): Promise<any> => {
		// console.log(`empLogin: ${empLogin} \n empMail: ${empMail}` );

		try {
			if (empLogin) {
				const props: any = {};
				const spFI = getSP();

				const profile = await spFI.profiles.getPropertiesFor(UsersInfoGraphSPO.escapeQuote(empLogin));

				profile.UserProfileProperties.forEach((prop: any) => {
					props[prop.Key] = prop.Value;
				});
				// console.log(`getPropertiesFor: ${JSON.stringify(props, null, 4)}`);

				return Promise.resolve(props);
			}
			else {
				return Promise.resolve([]);
			}
		}
		catch (error) {
			return Promise.reject(error);
		}

	}

	// Function to get user ID by email
	public static async getUserIdByEmail(email: string): Promise<number> {
		const spFI = getSP();

		const user = await spFI.web.siteUsers.getByEmail(email)();
		// console.log('user:', user);
		return user.Id;
	}

	/**
	 * Gets user properties for the specified user, add user mail for memberOf.
	 * @param context
	 * @param empLogin
	 * @param empMail
	 */
	public static getFullUserSharePoint = async (context: WebPartContext, empLogin: string, empMail: string): Promise<any> => {
		// console.log(`empLogin: ${empLogin} \n empMail: ${empMail}` );
		try {
			if (empLogin) {
				const props: any = {};
				const spFI = getSP();

				const profile: any = await spFI.profiles.getPropertiesFor(UsersInfoGraphSPO.escapeQuote(empLogin));

				profile.UserProfileProperties.forEach((prop: any) => {
					props[prop.Key] = prop.Value;
				});
				// console.log(`getPropertiesFor: ${JSON.stringify(props, null, 4)}`);

				if (empMail) {
					const userGroup = await UsersInfoGraphSPO.getUserGroups(context, empMail);

					const grpMof: string[] = [];
					userGroup.forEach((item: { name: any; groupTypes: any; }) => {
						grpMof.push(`name=${item.name},type=${item.groupTypes}`);
					});
					// console.log(`MemberOf: ${grpMof.length}`);

					props.MemberOf = grpMof;
				}

				return Promise.resolve(props);
			}
			else {
				return Promise.resolve([]);
			}
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Gets user properties for the specified user, from AAD with MsGraph
	 * @param context
	 * @param empLogin
	 * @param adAttribute
	 * @returns MsGraph User Info
	 */
	public static getUserMsGraph = async (context: WebPartContext, empLogin: string, adAttribute?: string): Promise<any> => {
		try {
			let colGraph = "";
			let retVal: any;
			// console.log('empLogin:', empLogin.split("|").pop());

			// const colGraph = "businessPhones, companyName, country, department, displayName, " +
			// 	"employeeId, givenName, jobTitle, mail, officeLocation, surname, userPrincipalName";
			if (adAttribute) {
				colGraph = adAttribute;
			}

			if (empLogin) {
				empLogin = empLogin.split("|").pop() as string;

				const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');

				const resp = await client.api("users").version("beta")
					.filter(`(userPrincipalName eq '${UsersInfoGraphSPO.escapeQuote(empLogin)}')`)
					.select(colGraph)
					.get();
				// console.log('getUserMsGraph-R:', resp);

				if (resp) {
					resp.value.map((item: any) => {
						retVal = item;
					});

					retVal = UsersInfoGraphSPO.removeAADprops(retVal);
				}
			}

			return Promise.resolve(retVal);
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Return full MsGraph profile with groups
	 * @param context
	 * @param someProp
	 * @param someVal
	 */
	public static getFullUserMsGraph = async (context: WebPartContext, someProp: string, someVal: string): Promise<any> => {
		// console.log("userMsGraph:\nP =", someProp, "V =", someVal);
		try {
			if (someVal) {
				const someUsers: any[] = [];

				context.msGraphClientFactory.getClient('3').then(
					async (client: MSGraphClientV3): Promise<void> => {
						await client.api("/users").version("beta").count(true)
						.filter(`startsWith(${someProp},'${UsersInfoGraphSPO.escapeQuote(someVal)}')`)
						.get(async (error: GraphError, resp?: any) => {
							// .get(async (error: GraphError, resp?: MicrosoftGraph.User) => {

							if (error) return Promise.reject(error);

							if (resp.value.length > 0) {
								// for await (const element of resp.value) {
								await UsersInfoGraphSPO.asyncForEach(resp.value, async (element: any) => {

									if (element.mail && element.userType !== "Guest") {
										await UsersInfoGraphSPO.getUserGroups(context, element.mail).then(async (userGroup) => {
											const grpMof: string[] = [];

											userGroup.forEach(async (item: { name: string; groupTypes: string; }) => {
												grpMof.push(`name=${item.name}, type=${item.groupTypes}`);
											});

											element.memberOf = grpMof;
										});
									}

									someUsers.push(UsersInfoGraphSPO.removeAADprops(element));
								});
								// }

								// console.log('someUsers', someUsers);
								return Promise.resolve(someUsers);
							}
							else {
								return Promise.resolve([]);
							}
						});
					}
				)
				.catch(error => {
					return Promise.reject(error);
				});
			}
			// return Promise.resolve(null);
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Return full MsGraph profile with groups
	 * @param context
	 * @param someProp
	 * @param someVal
	 */
	public static getFullUserNoMemberOf = async (context: WebPartContext, someProp: string, someVal: string): Promise<any> => {
		// debugger;
		// console.log("userMsGraph:\nP =", someProp, "V =", someVal);
		try {
			if (someVal) {
				const someUsers: any[] = [];

				await context.msGraphClientFactory.getClient('3').then(
					async (client: MSGraphClientV3): Promise<void> => {
						await client.api("/users").version("beta").count(true)
							.filter(`startsWith(${someProp},'${UsersInfoGraphSPO.escapeQuote(someVal)}')`)
							.get(async (error: GraphError, resp?: any) => {

								if (error) { return Promise.reject(error); }

								if (resp.value.length > 0) {
									someUsers.push(UsersInfoGraphSPO.removeAADprops(resp.value));
									return Promise.resolve(someUsers);
								}
								else {
									return Promise.resolve([]);
								}
							});
					}
				)
				.catch(error => {
					return Promise.reject(error);
				});
			}
			else {
				console.log('someUsers-null');
				return Promise.resolve(null);
			}
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 *
	 * @param context
	 * @param someMail
	 */
	public static getUserGroups = async (context: WebPartContext, someMail: string): Promise<any> => {
		interface IGroupItem {
			name: string;
			description: string;
			groupTypes: string;
		}

		try {
			const groupItems: IGroupItem[] = [];

			const retVal = await GroupInfoGraph.GetUserGroups(context, someMail).then((groups) => {
				// console.log('groups', groups);

				if (groups.length !== 0) {
					groups.map((group) => {
						if (group.displayName) {
							groupItems.push({
								name: group.displayName,
								description: group.description,
								groupTypes: group.groupTypes && group.groupTypes.length > 0 ? 'Office 365 Group' : group.securityEnabled === true ? 'Security Group' : 'Distribution Group'
							});
						}
					});
				}
				// console.log('groupItems', groupItems);
				return groupItems;
			});

			return Promise.resolve(retVal);
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 *
	 * @param someGroup
	 */
	public static getGroups = async (someGroup: string): Promise<IGroups[]> => {
		let groupItems: any[] = [];

		try {
			if (someGroup) {
				// single quote must be double escaped;
				// otherwise, the request will fail
				// someGroup = someGroup.replace(/[']/g, "''");
				const graphFI = getGraph();

				await graphFI.groups.search(`"displayName:${someGroup}"`)().then(async retGroups => {
					await UsersInfoGraphSPO.asyncForEach(retGroups, async (element: { [x: string]: any; id: string; }) => {
						groupItems = [];

						await graphFI.groups.getById(element.id).members().then(retInfo => {
							// console.log(`${element.id}: ${JSON.stringify(retInfo, null, 4)}`);
							retInfo.map((group) => {
								if (group.displayName) {
									groupItems.push(group.displayName);
								}
							});
							element.members = groupItems;
							return element;
						});
					});
					return Promise.resolve(retGroups);
				});
			}

			return Promise.resolve([]); // null
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 *
	 * @param userRole
	 */
	public static isUserInGroup = async (userRole: UserGroup | string): Promise<boolean> => {
		try {
			const spFI = getSP();
			let groupToCheck: string = "";

			switch (userRole) {
				case UserGroup.Visitor: {
					groupToCheck = (await spFI.web.associatedVisitorGroup()).Title;
					break;
				}
				case UserGroup.Member: {
					groupToCheck = (await spFI.web.associatedMemberGroup()).Title;
					break;
				}
				case UserGroup.Owner: {
					groupToCheck = (await spFI.web.associatedOwnerGroup()).Title;
					break;
				}
				default: {
					groupToCheck = userRole;
					break;
				}
			}

			const retVal = await spFI.web.currentUser.groups().then((siteGroups: ISiteGroupInfo[]) => {
				for (const group of siteGroups) {
					if (group.Title === groupToCheck) return true;
				}
				return false;
			});

			return Promise.resolve(retVal);
		}
		catch (error) {
			console.log('error');
			return Promise.reject(error);
		}
	}


	//#region Utilities
	/**
	 *
	 * @param array
	 * @param callback
	 */
	public static asyncForEach = async (array: any, callback: any): Promise<void> => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	/**
	 * Remove some Azure AD properties
	 * @param aadProps
	 */
	private static removeAADprops = (aadProps: any): any => {
		delete aadProps.assignedLicenses;
		delete aadProps.assignedPlans;
		delete aadProps.provisionedPlans;

		return aadProps;
	}

	/**
	 * Double single quote, otherwise, the request will fail
	 * @param someVal
	 */
	protected static escapeQuote = (someVal: string): string => {
		// someVal = someVal.replace(/'/g, "''");
		// someVal = someVal.replace(/[']/g, "''");

		return someVal.replace("'", "''");
	}
	//#endregion

}
