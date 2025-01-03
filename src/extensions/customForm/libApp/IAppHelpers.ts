// Application Interfaces
//---------------------------
export interface CustomListItem {
	// "odata.metadata": string;
	// "odata.type": string;
	// "odata.id": string;
	// "odata.etag": string;
	// "odata.editLink": string;
	// FileSystemObjectType: number;
	// ServerRedirectedEmbedUri: null | string;
	// ServerRedirectedEmbedUrl: string;
	// ID: number;
	// ContentTypeId: string;
	// Modified: string;
	// Created: string;
	// AuthorId: number;
	// EditorId: number;
	// OData__UIVersionString: string;
	// Attachments: boolean;
	// GUID: string;
	// OData__ColorTag: null | string;
	// ComplianceAssetId: null | string;
	Id: number;
	Title: string;

	clSingleText: string;
	clMultiLinesEnhance: string;
	clMultiLinesPlain: string;
	clChoiceDrop: string;
	clChoiceRadio: string;
	clChoiceCheck: string[];
	clNumber: number;
	clCurrency: number;
	clDate: string;
	clDateTime: string;
	clYesNo: boolean;
	clPersonId: number;
	clPersonStringId: string;
	clPersonGroupId: number;
	clPersonGroupStringId: string;
	clPersonMultiId: number[];
	clPersonMultiStringId: string[];

	clLink: DescriptionUrl;
	clPicture: DescriptionUrl;
	clImage: string;
	clTaskOutcome: string;
	clCalculated: string;
}

//---------------------------
export interface IDropDown {
	key: string;
	text: string;
}

//---------------------------
export interface FormDropOptions {
	clChoiceDrop: IDropDown[];
	clChoiceRadio: IDropDown[];
	clChoiceCheck: IDropDown[];
}

export interface DescriptionUrl {
	Description: string;
	Url: string;
}
