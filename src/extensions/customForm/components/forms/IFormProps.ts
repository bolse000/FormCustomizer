import { FormDisplayMode, Guid } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { CustomListItem, FormDropOptions } from "../../libApp/IAppHelpers";
import { IFormState } from "./IFormState";


// Default props for the form
export interface IFormProps {
	context: FormCustomizerContext;
	displayMode: FormDisplayMode;
	listGuid: Guid;
	itemId: number;

	onClose: () => void;
	onSave: () => Promise<void>;

	onDropOption: () => Promise<FormDropOptions>;
	onGetItem: (listGuid: string, itemId: number) => Promise<CustomListItem>;
	onStateChange: (newState: IFormState) => void;
}

// // DisplayMode
// export interface IDisplayProps extends IFormProps {
// 	itemId: number;
// }

// // EditMode
// export interface IEditProps extends IFormProps {
// 	itemId: number;

// 	onStateChange: (newState: IFormState) => void;
// 	onSave: () => Promise<void>;
// }

// // NewMode
// export interface INewProps extends IFormProps {
// 	onStateChange: (newState: IFormState) => void;
// 	onSave: () => Promise<void>;
// }
