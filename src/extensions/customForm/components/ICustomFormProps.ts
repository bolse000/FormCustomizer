import { FormDisplayMode, Guid } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

export interface ICustomFormProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
	listGuid: Guid;
	itemId: number;

	// getItem: (listGuid: string, itemId: number) => Promise<CustomListItem>;
  onSave: () => Promise<void>;
  onClose: () => void;
}
