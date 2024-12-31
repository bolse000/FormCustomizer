import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
// import { IFormState } from "../ICustomFormState";

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
	clPerson: string;
	clPersonGroup: string;
	clPersonMulti: string[];
	clLink: string;
	clPicture: string;
	clImage: string;
	clTaskOutcome: IDropdownOption;
}
