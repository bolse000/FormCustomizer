import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseFormCustomizer } from '@microsoft/sp-listview-extensibility';

import { getSP } from '../../common/utils/PnpSetup';

import CustomForm from './components/CustomForm';
import { ICustomFormProps } from './components/ICustomFormProps';
// import { SPFI } from '@pnp/sp/fi';
// import { IFieldInfo } from '@pnp/sp/fields/types';


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


	public render(): void {
		const element: React.ReactElement<ICustomFormProps> = React.createElement(
			CustomForm, {
				context: this.context,
				displayMode: this.displayMode,
				listGuid: this.context.list.guid,
				itemId: this.context.itemId,

				onSave: this.onSave,
				onClose: this.onClose
			} as ICustomFormProps
		);

		ReactDOM.render(element, this.domElement);
	}


	public onDispose(): void {
		ReactDOM.unmountComponentAtNode(this.domElement);
		super.onDispose();
	}

	private onSave = (): void => {
		// You MUST call this.formSaved() after you save the form.
		this.formSaved();
	}

	private onClose = (): void => {
		// You MUST call this.formClosed() after you close the form.
		this.formClosed();
	}
}
