import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
// import { IFormState } from "../ICustomFormState";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { DescriptionUrl } from "../../libApp/IAppHelpers";

export interface IProblemImage {
	problemFilePick?: IFilePickerResult[];
	problemFile?: File[];
}

export interface IFormState {
	isFormDisabled: boolean;

	Title: string;
	clSingleText: string;
	clMultiLinesEnhance: string;
	clMultiLinesPlain: string;

	clChoiceDrop: IDropdownOption;
	clChoiceRadio: IDropdownOption;
	clChoiceCheck: IDropdownOption[];

	clNumber: number;
	clCurrency: number;
	clDate: Date;
	clDateTime: Date;

	clYesNo: boolean;
	clPerson: string[];
	clPersonId?: number;
	clPersonGroup: string[];
	clPersonGroupId?: number;
	clPersonMulti: string[];
	clPersonMultiId?: number[];

	clLink: DescriptionUrl;
	clPicture: DescriptionUrl;

	clImage: IProblemImage;
	clTaskOutcome: IDropdownOption;
}
