/* eslint-disable  @typescript-eslint/no-explicit-any */

import { MSGraphClientV3 } from '@microsoft/sp-http';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { WebPartContext } from '@microsoft/sp-webpart-base';
// import * as MSGraph from '@microsoft/microsoft-graph-types';

import { HttpRequestError } from "@pnp/queryable";
import { IPeoplePickerContext } from '@pnp/spfx-controls-react/lib/controls/peoplepicker';


export class SaqUtils {
	//
	public static setPeoplePickerContext = (someContext: FormCustomizerContext): IPeoplePickerContext => {
		return {
			absoluteUrl: someContext.pageContext.web.absoluteUrl,
			msGraphClientFactory: someContext.msGraphClientFactory,
			spHttpClient: someContext.spHttpClient
		};
	};

	/**
	 * Log and return a formatted error message.
	 * @param error unknown
	 * @returns Formatted error string.
	 */
	public static async handleError(error: unknown): Promise<string> {
		// console.log('error:', error);
		let errMsg: string;

		const httpError = async (errHttp: HttpRequestError): Promise<string> => {
			// read the json from the response
			const data = await errHttp.response.json();

			// extract message
			const message = typeof data["odata.error"] === "object" ? data["odata.error"].message.value : errHttp.message;
			return `${errHttp.name}: ${data["odata.error"].code}. \nMessage: ${message}`;
		}

		const getError = (e: Error): string => {
			return e.message;
		}

		switch (true) {
			case error instanceof Error:
				// console.log('Error:');
				errMsg = getError(error as Error);
				break;

			case error instanceof HttpRequestError:
				// console.log('HttpRequestError:');
				errMsg = await httpError(error as HttpRequestError);
				break;

			case error instanceof Object:
				// console.log('Object:');
				errMsg = JSON.stringify(error);
				break;

			default:
				// console.log('default:');
				errMsg = String(error);
				break;
		}
		// console.log('errMsg:', errMsg);

		return Promise.resolve(errMsg);
	}


	/**
	 * Send Mail through MSGraphClient
	 * @param pageContext
	 * @param mailTitle
	 * @param mailBody
	 * @param mailTo
	 * @param mailCc
	 * @param mailAtt
	 */
	public static async sendMail(pageContext: WebPartContext,
		mailTitle: string, mailBody: string, mailTo: any[], mailCc?: any[], mailAtt?: any
	): Promise<void> {

		try {
			const emailPost: any = {
				message: {
					subject: mailTitle,
					body: {
						contentType: "HTML",
						content: mailBody
					},
					toRecipients: mailTo,
					ccRecipients: mailCc,
					attachments: mailAtt ? [{
						"@odata.type": "#microsoft.graph.fileAttachment",
						name: mailAtt.fileName,
						contentBytes: mailAtt.fileAttach,
						contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					}] : []
				}
			};
			// console.log('emailPost: ', emailPost);

			const graphClient: MSGraphClientV3 = await pageContext.msGraphClientFactory.getClient('3');

			await graphClient.api('/me/sendMail').post(emailPost, (error: any, response: any, rawResponse?: any) => {
				// handle the response
				// console.log('response', response, '\n', 'rawResponse', rawResponse, '\n', 'error', error);

				if (!error) {
					return Promise.resolve();
				}
				else {
					console.log('error-message', error.message, '\nstatusCode: ', error.statusCode, '\nstack: ', error.stack);

					throw new Error(`${error.statusCode}-${error.message}`);
				}
			});
		}
		catch (error) {
			console.log('error', error);
			return Promise.reject(error);
		}
	}


	/**
	 * Search for querystring in current URL.
	 * @param searchQS query string to search for
	 */
	public static getUrlParam(searchQS: string): Promise<string> {
		try {
			const params = new URLSearchParams(document.location.search.substring(1));
			const retVal = params.get(searchQS) ?? "";

			return Promise.resolve(retVal);
		}
		catch (error) {
			return Promise.reject(error);
		}
	}


	/**
	 * Replace strWithPlaceH with valuesToReplace
	 * @param strWithPlaceH string with {PlaceHolder}
	 * @param valueToReplace some value
	 *
	 * @example SaqUtil.strInject("{someText} To Be {Replace}}", someValue)
	 */
	public static strInject(strWithPlaceH: any, valueToReplace: any): string {
		const regex = /{\w+}/g;
		const retVal = strWithPlaceH.replace(regex, (placeholder: string) =>
			valueToReplace[placeholder.substring(1, placeholder.length - 1)] || "",
		);

		return retVal;
	}


	/**
	 * Replaces the format items in a string with some values
	 * @param args
	 *
	 * @example SaqUtil.strFormat("some {0} and {1}", someValue, otherValue)
	 */
	public static strFormat(...args: any[]): string {
		let retVal = args[0]; //always first argument

		// start with second args
		for (let x = 1; x < args.length; x++) {
			// eslint-disable-next-line @rushstack/security/no-unsafe-regexp
			const regEx = new RegExp("\\{" + (x - 1) + "\\}", "gm"); //gm == Global and Multiline search
			retVal = retVal.replace(regEx, args[x]);
		}

		return retVal;
	}


	/**
	 *
	 * @param someDate Date | string
	 * @param longFormat boolean
	 * @returns 2023-10-02 | lun. 02 octobre 2023
	 */
	public static formatDate = (someDate: Date | string | undefined, longFormat?: boolean): string => {
		// console.log('typeof:', typeof someDate, 'someDate:', someDate);

		if (!someDate) return "";

		const dtNew: Date = new Date(someDate);
		// console.log('dtNew:', dtNew);

		if (longFormat) {
			const options: Intl.DateTimeFormatOptions = {
				weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour12: false
			};
			return dtNew.toLocaleDateString('fr-CA', options);
		}

		return dtNew.toLocaleDateString('fr-CA');
	}

	/**
	 *
	 * @param someDate Date | string
	 * @param longFormat boolean
	 * @returns mardi 26 novembre 2024 à 15 h 19 | 2024-11-26, 15:06
	 */
	public static formatDateTime(someDate: Date | string, longFormat?: boolean): string {
		// console.log('someDate: ', typeof someDate);

		const dtNew: Date = new Date(someDate);

		if (longFormat) {
			// const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
			// const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short', timeZone: 'UTC' }
			const options: Intl.DateTimeFormatOptions = { dateStyle: 'full', timeStyle: 'short', hour12: false, };
			return dtNew.toLocaleString('fr-CA', options);
		}

		const mediumTime = new Intl.DateTimeFormat("en-CA", {
			dateStyle: "short",
			timeStyle: "short",
			hour12: false
		});
		return mediumTime.format(dtNew);
	}

	/**
	 * Format date to "ven. 4 février 2022"
	 * @param someDate
	 * @param options { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }
	 */
	public static formatDateWithOptions(someDate: Date | string, options: Intl.DateTimeFormatOptions): string {
		// const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

		const dtNew: Date = new Date(someDate);

		return dtNew.toLocaleString('fr-CA', options);
	}


	/**
	 * Navigate to some page.
	 * @param somePage Link to go to
	 */
	public static gotoPage(somePage?: string): void {
		// console.log("isUrlAbsolute: ", /^https?:\/\/|^\/\//i.test(somePage), '\nsomePage: ', somePage);

		if (!somePage) {
			this.navigate(window.location.href, false);
		}
		else {
			// TODO: should check if it start with http
			this.navigate(somePage);
		}
	}


	/**
	 * Navigate to the provided link
	 *
	 * @param {string} link - Link to navigate to
	 * @param {boolean} fullPageReload - (optional) partial page reload - false / or full page reload - true
	 */
	private static navigate(link: string, fullPageReload: boolean = false): void {
		// Check if we can bind into the SPFx navigation APIs
		if (!fullPageReload && history && (window.PopStateEvent || window.Event) && window.dispatchEvent) {
			// Create the new navigation state
			const navState = { url: link };

			// Adds the new navigation state to the browser history
			history.pushState(navState, "", link);

			// console.log("link:", link, "\nnavState:", navState);
			// Check to trigger SharePoint navigation handler to partially reload the page
			let newPopState: any = null;
			const popStateString = "popstate";
			const eventString = "Event";
			const stateString = "state";

			try {
				if (window.PopStateEvent) {
					// console.log("PopStateEvent:", window["PopStateEvent"]);
					newPopState = new PopStateEvent(popStateString, { state: navState });
				}

				if (window[eventString] && !newPopState) {
					newPopState = new Event(popStateString);
					newPopState[stateString] = navState;
					// console.log("eventString:", window[eventString]);
				}

				// console.log("history.state:", JSON.stringify(history.state));
				if (!newPopState) {
					newPopState = new PopStateEvent(popStateString, {
						bubbles: false,
						cancelable: true,
						state: navState
					});
				}
			}
			catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
				// console.log("newPopState:", err);
				newPopState = document.createEvent(eventString);
				newPopState.initEvent(popStateString, false, true);
				newPopState[stateString] = navState;
			}

			// console.log("newPopState:", newPopState);
			if (newPopState) {
				const isDispatched = window.dispatchEvent(newPopState);
				if (isDispatched) {
					// console.log("Bye Bye!!!");
					history.go();
					return;
				}
			}
		}

		// console.log("Worst case, Redirect the old way!!!");
		location.href = link;
	}
}
