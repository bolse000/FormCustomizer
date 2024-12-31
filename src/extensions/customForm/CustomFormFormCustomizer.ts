import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseFormCustomizer } from '@microsoft/sp-listview-extensibility';

import { getSP } from '../../common/utils/PnpSetup';

import CustomForm from './components/CustomForm';
import { ICustomFormProps } from './components/ICustomFormProps';
import { SPFI } from '@pnp/sp/fi';
import { IFieldInfo } from '@pnp/sp/fields/types';


/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICustomFormFormCustomizerProperties {
  sampleText?: string;
}

export default class CustomFormFormCustomizer extends BaseFormCustomizer<ICustomFormFormCustomizerProperties> {
	// private spFI: SPFI;

	public async onInit(): Promise<void> {
		await super.onInit();
		console.log('onInit:', this.context);

		try {
			// this.spFI = getSP(this.context);
			getSP(this.context);
		}
		catch (error) {
			console.error(error);
		}

		return Promise.resolve();
	}
	// public async onInitX(): Promise<void> {
	// 	await super.onInit();
	// 	try {
	// 		// Add your custom initialization to this method. The framework will wait
	// 		// for the returned promise to resolve before rendering the form.
	// 		// console.log('CustomFormFormCustomizer:', this.context);
	// 		this.spFI = getSP(this.context);
	// 		// const listGuid = this.context.list.guid.toString();
	// 		// console.log('listGuid', listGuid);

	// 		// const someList = spFI.web.lists.getById(listGuid);
	// 		// console.log('someList:', someList);

	// 		if (this.displayMode === FormDisplayMode.New) {
	// 			// we're creating a new item so nothing to load
	// 			return Promise.resolve();
	// 		}
	// 		else {
	// 			// load item to display on the form
	// 			await this.loadItem();
	// 			console.log('this._item', this.listItem);

	// 			// this.pnpListItem = spFI.web.lists.getById(listGuid).items;
	// 			// const someList = spFI.web.lists.getById(listGuid);
	// 			// console.log('this.pnpListItem', someList);
	// 		}
	// 	}
	// 	catch (error) {
	// 		console.error(error);
	// 	}

	// 	return Promise.resolve();
	// }

	// private loadItem = async (): Promise<void> => {
	// 	try {
	// 		// load the item
	// 		const listGuid = this.context.list.guid.toString();
	// 		console.log('listGuid', listGuid);
	// 		const itemId = this.context.item?.ID; //.itemId
	// 		console.log('itemId', itemId);

	// 		if (!itemId) return;

	// 		const item = await this.spFI.web.lists.getById(listGuid).items.getById(itemId)();
	// 		this.listItem = item;
	// 		this.etag = item['odata.etag'];
	// 	}
	// 	catch (error) {
	// 		console.error(error);
	// 	}

	// 	return Promise.resolve();
	// }


  public render(): void {
    // Use this method to perform your custom rendering.
    const customForm: React.ReactElement<ICustomFormProps> =
      React.createElement(CustomForm, {
				context: this.context,
				displayMode: this.displayMode,
				listGuid: this.context.list.guid,
				// itemId: this.context.item?.ID || -1,
				itemId: this.context.itemId,
				// getItem: (listGuid: string, itemId: number) => this.getItem(listGuid, itemId),
				onSave: this.onSave,
				onClose: this.onClose
			} as ICustomFormProps);

    ReactDOM.render(customForm, this.domElement);
  }


  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private onSave = (): void => {
    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
  }

  private onClose =  (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }
}
