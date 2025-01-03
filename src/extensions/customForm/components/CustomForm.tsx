import * as React from 'react';

import { FormDisplayMode } from '@microsoft/sp-core-library';

import { PrimaryButton } from '@fluentui/react/lib/Button';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Separator } from '@fluentui/react/lib/Separator';

// import FormDisplay from './forms/FormDisplay';
import FormDisplayEdit from './forms/FormDisplayEdit';
import FormNew from './forms/FormNew';

import styles from './CustomForm.module.scss';
import { ICustomFormProps } from './ICustomFormProps';
import { DemoRow } from '../../../common/components/CommonComponents';
import { CustomListItem, FormDropOptions } from '../libApp/IAppHelpers';
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
	// // Added for item's etag to ensure integrity of the update; used with edit form
	// private etag?: string;

	//#region Lifecycle
	constructor(props: ICustomFormProps) {
		super(props);
		// console.log('CustomForm:', props);
		this.spFI = getSP();
	}

  public async componentDidMount(): Promise<void> {
		console.time('CustomForm');
		// if (this.props.displayMode === FormDisplayMode.New) {
		// 	// we're creating a new item so nothing to load
		// 	return Promise.resolve();
		// }
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

		const cmdBarSave: ICommandBarItemProps[] = [
			{
				key: 'saveItem',
				text: 'Save',
				iconProps: { iconName: 'Save' },
				onRender: (item) => this.renderSaveButton(item)
			},
			cmdCancel
		];

		const cmdBarEdit: ICommandBarItemProps[] = [
			{
				key: 'EditItem',
				text: 'Edit',
				iconProps: { iconName: 'Edit' },
				className: styles.commandBarItems,
				onClick: () => this.onClickEditItem()
			},
			cmdCancel
		];

		return this.props.displayMode === FormDisplayMode.Display ? cmdBarEdit : cmdBarSave;
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

	private onClickEditItem(): boolean | void {
		// this.props.onChangeDisplayMode(FormDisplayMode.Edit);

		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("PageType")) {
			searchParams.set("PageType", FormDisplayMode.Edit.toString());
			window.location.href = location.protocol + "//" + location.host + location.pathname + "?" + searchParams;
		}
	}

	private validateForm = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
		ev.preventDefault();
		// console.log('props:', this.props);
		// console.log('state:', this.state);
		try {
			await this.saveItem();

			await this.props.onSave();
			this.props.onClose();
		}
		catch (error) {
			console.error(error);
		}
	}

	private saveItem = async (): Promise<void> => {
		try {
			const {
				Title,
				clSingleText, clMultiLinesPlain, clMultiLinesEnhance,
				clChoiceDrop, clChoiceRadio, clChoiceCheck,
				clNumber, clCurrency, clDate, clDateTime, clYesNo,
				clPersonId, clPersonGroupId, clPersonMultiId,
				// clPerson, clPersonGroup, clPersonMulti,
				// clLink, clPicture, clTaskOutcome
			} = this.state.childState;
			console.log('saveItem:', this.state);

			const spList = this.spFI.web.lists.getById(this.props.listGuid.toString());
			await spList.items.getById(this.props.itemId).update({
				Title: Title,
				clSingleText: clSingleText,
				clMultiLinesEnhance: clMultiLinesEnhance,
				clMultiLinesPlain: clMultiLinesPlain,
				clChoiceDrop: clChoiceDrop.key,
				clChoiceRadio: clChoiceRadio.key,
				clChoiceCheck: clChoiceCheck.map((item) => item.key),
				clNumber: clNumber,
				clCurrency: clCurrency,
				clDate: clDate,
				clDateTime: clDateTime,
				clYesNo: clYesNo,

				clPersonId: clPersonId,
				clPersonGroupId: clPersonGroupId,
				clPersonMultiId: clPersonMultiId,
				// clPerson: clPerson,
				// clPersonGroup: clPersonGroup,
				// clPersonMulti: clPersonMulti,
			});
			// console.log('item:', item);

			// await this.props.onSave();
		}
		catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	}


	private getListCustomFields = async (listGuid: string): Promise<IFieldInfo[]> => {
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
	}

	private fetchFieldChoices = async (listGuid: string, fieldName: string): Promise<string[]> => {
		const customFields = await this.getListCustomFields(listGuid);
		// console.log('customFields:', customFields);
		const fieldChoices = customFields.find(field => field.Title === fieldName)?.Choices;
		// console.log('fieldChoices:', fieldChoices);

		return Promise.resolve(fieldChoices ?? []);
	}

	private getDropdownOptions = async (): Promise<FormDropOptions> => {
		const [optionsCheck, optionsRadio, optionsDrop] = await Promise.all([
			this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceCheck'),
			this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceRadio'),
			this.fetchFieldChoices(this.props.listGuid.toString(), 'clChoiceDrop')
		]);

		return ({
			'clChoiceCheck': optionsCheck.map((item) => ({ key: item, text: item })),
			'clChoiceRadio': optionsRadio.map((item) => ({ key: item, text: item })),
			'clChoiceDrop': optionsDrop.map((item) => ({ key: item, text: item }))
		});
	}

	private loadItemById = async (listGuid: string, itemId: number): Promise<CustomListItem> => {
		// console.log('getItem:', listGuid, '\nitemId:', itemId);
		const item: CustomListItem = await this.spFI.web.lists.getById(listGuid).items.getById(itemId)();

		return Promise.resolve(item);
	}

	private handleChildState = (newState: IFormState): void => {
		// console.log('childState:', newState);
		this.setState({ childState: newState });
	}


	public render(): React.ReactElement<ICustomFormProps> {
		// const { displayMode } = this.props;
		return (
			<section className={styles.customForm}>
				<form onSubmit={this.validateForm}>
					<CommandBar items={this.getCommandBarItems()} />
					<Separator className={styles.commandBarSeparators} />
					<div className={styles.formContainer}>
						{this.props.displayMode === FormDisplayMode.New ? (
							<FormNew
								onDropOption={() => this.getDropdownOptions()}
								onGetItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								onStateChange={this.handleChildState}
								{...this.props}
							/>
						) : (
							<FormDisplayEdit
								onDropOption={() => this.getDropdownOptions()}
								onGetItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								onStateChange={this.handleChildState}
								{...this.props}
							/>
						)}
						{/* {displayMode === FormDisplayMode.Edit && (
							<FormEdit
								context={this.props.context}
								displayMode={displayMode}
								listGuid={listGuid}
								itemId={itemId}
								onDropOption={() => this.getDropdownOptions()}
								getItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								onStateChange={this.handleChildState}
								onSave={this.saveItem}
								onClose={this.props.onClose}
							/>
						)}
						{displayMode === FormDisplayMode.Display && (
							<FormDisplay
								onDropOption={() => this.getDropdownOptions()}
								getItem={(listGuid: string, itemId: number) => this.loadItemById(listGuid, itemId)}
								{...this.props}
							/>
						)} */}
						<DemoRow />
					</div>
				</form>
			</section>
		);
	}
}
