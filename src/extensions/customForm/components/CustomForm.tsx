import * as React from 'react';

import { FormDisplayMode } from '@microsoft/sp-core-library';

import { PrimaryButton } from '@fluentui/react/lib/Button';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Separator } from '@fluentui/react/lib/Separator';

import FormDisplay from './forms/FormDisplay';
import FormEdit from './forms/FormEdit';
import FormNew from './forms/FormNew';

import styles from './CustomForm.module.scss';
import { ICustomFormProps } from './ICustomFormProps';
import { DemoRow } from '../../../common/components/CommonComponents';
import { CustomListItem } from '../libApp/IAppHelpers';
import { SPFI } from '@pnp/sp/fi';
import { getSP } from '../../../common/utils/PnpSetup';
import { ICustomFormState,  } from './ICustomFormState';
import { IFormState } from './forms/IFormState';
import { IFieldInfo } from '@pnp/sp/fields/types';

// For Ms-Grid layout
require('@fluentui/react/dist/css/fabric.css');
//import '@fluentui/react/dist/css/fabric.min.css';


export default class CustomForm extends React.Component<ICustomFormProps, ICustomFormState> {
	private spFI: SPFI;
  // private pnpListItem: IItems;
	// // Added for the item to show in the form; use with edit and view form
	// private listItem: { Title?: string; };
	// // Added for item's etag to ensure integrity of the update; used with edit form
	// private etag?: string;

	//#region Lifecycle
	constructor(props: ICustomFormProps) {
		super(props);
		// console.log('CustomForm:', props);

		// this.state = {
		// 	childState: {
		// 		isFormDisabled: false,
		// 		Title: '',
		// 		clSingleText: '',
		// 		clMultiLinesEnhance: '',
		// 		clMultiLinesPlain: '',
		// 	}
		// };

		this.spFI = getSP();
	}

  public async componentDidMount(): Promise<void> {
		console.time('CustomForm');

		// this.loadListFields(this.context.list.guid.toString());
		// const optionsCheck = await this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceCheck');
		// console.log('optionsCheck:', optionsCheck);
		// const optionsRadio = await this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceRadio');
		// console.log('optionsRadio:', optionsRadio);
		// const optionsDrop = await this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceDrop');
		// console.log('optionsDrop:', optionsDrop);

		const [optionsCheck, optionsRadio, optionsDrop] = await Promise.all([
			this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceCheck'),
			this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceRadio'),
			this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceDrop')
		]);
		console.log('optionsCheck:', optionsCheck);
		console.log('optionsRadio:', optionsRadio);
		console.log('optionsDrop:', optionsDrop);

		if (this.props.displayMode === FormDisplayMode.New) {
			// we're creating a new item so nothing to load
			return Promise.resolve();
		}

		console.timeEnd('CustomForm');
  }

  public componentWillUnmount(): void {
    console.log('CustomForm unmounted');
  }
	//#endregion


	private getCommandBarItems = (): ICommandBarItemProps[] => {
    const cmdCancel: ICommandBarItemProps = {
      key: 'cancelItem',
      text: 'Cancel',
      iconProps: { iconName: 'Cancel' },
      onClick: () => this.props.onClose(),
      className: styles.commandBarItems
    };

		const cmdSave: ICommandBarItemProps[] = [
			{
				key: 'saveItem',
				text: 'Save',
				iconProps: { iconName: 'Save' },
				onRender: (item) => this.renderSaveButton(item)
			},
			cmdCancel
		];

    const cmdEdit: ICommandBarItemProps[] = [
      {
        key: 'EditItem',
        text: 'Edit',
        iconProps: { iconName: 'Edit' },
        className: styles.commandBarItems,
        onClick: () => this.onClickEditItem()
      },
			cmdCancel
    ];

    return this.props.displayMode === FormDisplayMode.Display ? cmdEdit : cmdSave;
  }

  private onClickEditItem(): boolean | void {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("PageType")) {
      searchParams.set("PageType", FormDisplayMode.Edit.toString());
      window.location.href = location.protocol + "//" + location.host + location.pathname + "?" + searchParams;
    }
  }

	private renderSaveButton = (item: ICommandBarItemProps): React.ReactNode => {
		return (
			<PrimaryButton
				type="submit"
				className={styles.commandBarItems}
				styles={item.buttonStyles}
				text={item.text}
				iconProps={item.iconProps}
			/>
		);
	}

	private fetchFieldChoices = async (listGuid: string, fieldName: string): Promise<string[]> => {
		const customFields = await this.getListFields(listGuid);
		// console.log('customFields:', customFields);
		// customFields.forEach(field => {
		// 	console.log(`${field.Title}: ${field.TypeAsString}`);
		// });

		const fieldChoices = customFields.find(field => field.Title === fieldName)?.Choices;
		// console.log('clChoiceCheck:', clChoiceCheck);
		return Promise.resolve(fieldChoices?? []);
	};

	private getListFields = async (listGuid: string): Promise<IFieldInfo[]> => {
		try {
			const fields: IFieldInfo[] = await this.spFI.web.lists.getById(listGuid).fields();
			const customFields = fields.filter(field => !field.FromBaseType && !field.Hidden);
			// console.log('IFieldInfo:', customFields);
			return customFields;
		}
		catch (error) {
			console.error('Error getting fields:', error);
			throw error;
		}
	};

	private loadItemById = async (listGuid: string, itemId: number): Promise<CustomListItem> => {
		// console.log('getItem:', listGuid, '\nitemId:', itemId);
		// this.getListFields(listGuid).then(customFields => {
		// 	customFields.forEach(field => {
		// 		//console.log(`Field ${field.TypeAsString}: ${field.Title}`);
		// 		console.log(`${field.Title}: ${field.TypeAsString}`);
		// 	});
		// }).catch(error => {console.error('Error getting fields:', error);});

		const item: CustomListItem = await this.spFI.web.lists.getById(listGuid).items.getById(itemId)();

		return Promise.resolve(item);
		// throw new Error('Function not implemented.');
	}

	// private validateForm = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
	// 	ev.preventDefault();
	// 	console.log('props:', this.props);
	// 	try {
	// 		console.log('ev:', this.state);
	// 		// const item = await this.spFI.web.lists.getById(this.props.listGuid).items.add(this.state);
	// 		// console.log('item:', item);
	// 		// this.props.onClose
	// 	}
	// 	catch (error) {
	// 		console.error(error);
	// 	}
	// }

	// private saveItem = async (): Promise<void> => {
	// 	console.log('saveItem:', this.props);

	// 	const spList = this.spFI.web.lists.getById(this.props.listGuid.toString());
	// 	const item = await spList.items.getById(this.props.itemId).update({
	// 		Title: 'New Title',
	// 		clSingleText: 'New Single Text',
	// 		clMultiLinesEnhance: 'New Multi Lines Enhance',
	// 		clMultiLinesPlain: 'New Multi Lines'
	// 	});

	// 	console.log('item:', item);
	// 	this.props.onClose();
	// }

	private validateForm = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
		ev.preventDefault();
		// console.log('props:', this.props);
		try {
			// console.log('state:', this.state);
			// const item = await this.spFI.web.lists.getById(this.props.listGuid).items.add(this.state);
			// console.log('item:', item);
			// this.props.onClose
			await this.saveItem();
			// await this.props.onSave();
			this.props.onClose();
		}
		catch (error) {
			console.error(error);
		}
	}

	private saveItem = async (): Promise<void> => {
		console.log('saveItem:', this.state);
		// const { childState: { Title, clSingleText, clMultiLinesPlain, clMultiLinesEnhance } } = this.state;
		const {
			Title,
			clSingleText, clMultiLinesPlain, clMultiLinesEnhance,
			clChoiceDrop, clChoiceRadio, clChoiceCheck
		} = this.state.childState;

		const spList = this.spFI.web.lists.getById(this.props.listGuid.toString());
		// const item =
		await spList.items.getById(this.props.itemId).update({
			Title: Title,
			clSingleText: clSingleText,
			clMultiLinesEnhance: clMultiLinesEnhance,
			clMultiLinesPlain: clMultiLinesPlain,

			clChoiceDrop: clChoiceDrop.key,
			clChoiceRadio: clChoiceRadio.key,
			clChoiceCheck: clChoiceCheck.map((item) => item.key)
		});
		// console.log('item:', item);
		// this.props.onClose();
			await this.props.onSave();
	}

	private handleChildState = (newState: IFormState): void => {
		// console.log('childState:', newState);
		this.setState({ childState: newState });
	};


	public render(): React.ReactElement<ICustomFormProps> {
		const { displayMode, listGuid, itemId } = this.props;
		return (
			<section className={styles.customForm}>
				<form onSubmit={this.validateForm}>
					<CommandBar items={this.getCommandBarItems()} />
					<Separator className={styles.commandBarSeparators} />
					<div className={styles.formContainer}>
						{displayMode === FormDisplayMode.New && (
							<FormNew
								getItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								onStateChange={this.handleChildState}
								{...this.props}
							/>
						)}
						{displayMode === FormDisplayMode.Edit && (
							<FormEdit
								context={this.props.context}
								displayMode={displayMode}
								listGuid={listGuid}
								itemId={itemId}
								getItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								onStateChange={this.handleChildState}
								onSave={this.saveItem}
								onClose={this.props.onClose}
							/>
						)}
						{displayMode === FormDisplayMode.Display && (
							<FormDisplay
								// dataProvider={{
								// 	getItem: (listGuid: string, itemId: number) => this.getItem(listGuid, itemId)
								// }}
								getItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								{...this.props}
							/>
						)}
						<DemoRow />
					</div>
				</form>
			</section>
		);
	}
}
