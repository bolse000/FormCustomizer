// Interface for the JSON structure
export interface CustomListItem {
	// "odata.metadata": string;
	// "odata.type": string;
	// "odata.id": string;
	// "odata.etag": string;
	// "odata.editLink": string;
	// FileSystemObjectType: number;
	Id: number;
	// ServerRedirectedEmbedUri: null | string;
	// ServerRedirectedEmbedUrl: string;
	// ID: number;
	// ContentTypeId: string;
	Title: string;
	// Modified: string;
	// Created: string;
	// AuthorId: number;
	// EditorId: number;
	// OData__UIVersionString: string;
	// Attachments: boolean;
	// GUID: string;
	// OData__ColorTag: null | string;
	// ComplianceAssetId: null | string;

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
	clLink: {
		Description: string;
		Url: string;
	};
	clPicture: {
		Description: string;
		Url: string;
	};
	clImage: string;
	clTaskOutcome: string;
	clCalculated: string;
}
