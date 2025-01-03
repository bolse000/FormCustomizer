import * as React from 'react';

import styles from './FormDEN.module.scss';
import { IFormProps } from './IFormProps';
import { IFormState } from './IFormState';
import { TextField } from '@fluentui/react/lib/TextField';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DatePickerStrings } from '../../../../common/utils/DatePickerStrings';
import { SaqUtils } from '../../../../common/utils/SaqUtils';
import { TimePicker } from '@fluentui/react/lib/TimePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Toggle } from '@fluentui/react/lib/Toggle';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
// import { FieldUrlRenderer } from '@pnp/spfx-controls-react/lib/FieldUrlRenderer';
// import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { UsersInfoGraphSPO } from '../../../../common/services/UsersInfoGraphSPO';
import { CustomListItem, FormDropOptions } from '../../libApp/IAppHelpers';
import { FormDisplayMode } from '@microsoft/sp-core-library';


export default class FormDisplayEdit extends React.Component<IFormProps, IFormState> {
	//
	private readonly peoplePickerContext = SaqUtils.setPeoplePickerContext(this.props.context);
	private ddOptions: FormDropOptions = {
		clChoiceDrop: [{ key: '', text: '' }],
		clChoiceRadio: [{ key: '', text: '' }],
		clChoiceCheck: [{ key: '', text: '' }]
	};

	//#region Lifecycle
	constructor(props: IFormProps) {
		super(props);
		// console.log('FormEdit:', props);

		this.state = {
			isFormDisabled: this.props.displayMode === FormDisplayMode.Edit ? false : true,

			Title: '',
			clSingleText: '',
			clMultiLinesEnhance: '',
			clMultiLinesPlain: '',

			clChoiceDrop: { key: '', text: '' },
			clChoiceRadio: { key: '', text: '' },
			clChoiceCheck: [{ key: '', text: '' }],

			clNumber: 0,
			clCurrency: 0,
			clDate: new Date(),
			clDateTime: new Date(),
			clYesNo: false,
			clPerson: [],
			clPersonGroup: [],
			clPersonMulti: [],
			clLink: { Description: '', Url: '' },
			clPicture: { Description: '', Url: '' },
			clImage: { problemFilePick: undefined },
			clTaskOutcome: { key: '', text: '' }
		};
	}

	// Executed after component is rendered
	public async componentDidMount(): Promise<void> {
		console.time('FormEdit');

		const dropOptions = await this.props.onDropOption();
		if (!dropOptions) return;

		this.ddOptions = {
			clChoiceCheck: dropOptions.clChoiceCheck,
			clChoiceRadio: dropOptions.clChoiceRadio,
			clChoiceDrop: dropOptions.clChoiceDrop
		};
		// console.log('ddOptions:', this.ddOptions);

		const item = await this.getItemFromProps();
		// console.log('getItemFromProps:', item);
		await this.setFormItem(item);

		console.timeEnd('FormEdit');
	}

	// Executed after component is rendered
	public async componentDidUpdate(
		_prevProps: Readonly<IFormProps>, _prevState: Readonly<IFormState>
	): Promise<void> {
    if (_prevState !== this.state) {
      this.props.onStateChange(this.state);
    }
  }
	//#endregion


	//#region Set Item
	private async getItemFromProps(): Promise<CustomListItem> {
		const { listGuid, itemId } = this.props;
		const item = await this.props.onGetItem(listGuid.toString(), itemId);

		return item;
	}

	private setFormItem = async (item: CustomListItem): Promise<void> => {
		// console.log('setFormItem:', item);
		const [mailPerson, mailPersonGroup, mailPersonMulti] = await this.loadMailAddresses(item);

		this.setState({
			Title: item.Title,
			clSingleText: item.clSingleText,
			clMultiLinesEnhance: item.clMultiLinesEnhance,
			clMultiLinesPlain: item.clMultiLinesPlain,
			clChoiceDrop: { key: item.clChoiceDrop, text: item.clChoiceDrop },
			clChoiceRadio: { key: item.clChoiceRadio, text: item.clChoiceRadio },
			clChoiceCheck: item.clChoiceCheck.map((item) => ({ key: item, text: item })),
			clNumber: item.clNumber,
			clCurrency: item.clCurrency,
			clDate: new Date(item.clDate),
			clDateTime: new Date(item.clDateTime),
			clYesNo: item.clYesNo,

			clPerson: mailPerson,
			clPersonId: item.clPersonId,
			clPersonGroup: mailPersonGroup,
			clPersonGroupId: item.clPersonGroupId,
			clPersonMulti: mailPersonMulti.flat(),
			clPersonMultiId: item.clPersonMultiId,

			clLink: item.clLink,
			clPicture: item.clPicture,
		}
			// , () => { console.log('setFormItem:', this.state) }
		);
	}

	private async loadMailAddresses(item: CustomListItem): Promise<[string[], string[], string[][]]> {
		const getMail = async (someId: number): Promise<string[]> => {
			try {
				const user = await UsersInfoGraphSPO.getUserById(someId);
				return user.Email ? [user.Email] : [];
			} catch (error) {
				console.error(`Error fetching user with ID ${someId}:`, error);
				return [];
			}
		};

		try {
			return await Promise.all([
				getMail(item.clPersonId),
				getMail(item.clPersonGroupId),
				Promise.all(item.clPersonMultiId.map((id) => getMail(id)))
			]);
		} catch (error) {
			console.error('Error loading mail addresses:', error);
			throw error;
		}
	}
	private async loadMailAddressesX(item: CustomListItem): Promise<[string[], string[], string[][]]> {
		const getMail = async (someId: number): Promise<string[]> => {
			const user = await UsersInfoGraphSPO.getUserById(someId);
			return user.Email ? [user.Email] : [];
		};

		try {
			return await Promise.all([
				getMail(item.clPersonId),
				getMail(item.clPersonGroupId),
				Promise.all(item.clPersonMultiId.map((id) => getMail(id)))
			]);
		}
		catch (error) {
			console.error('Error loading mail addresses:', error);
			throw error;
		}
	}
	//#endregion


	//#region Field Change
	private chgField = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		someValue?: string | undefined
	): void => {
    const { id } = ev.target as HTMLInputElement;
		// console.log('chgField:', id, '\nvalue:', someValue);

		this.setState((prevState) => ({
			...prevState,
			[id]: someValue || ''
		}));
	}

	private chgRichText = (someText: string, target: string): string => {
		// console.log('chgRichText:', someText);

		this.setState((prevState) => ({
			...prevState,
			[target]: someText || ''
		}));
		return someText;
	}

	private chgDropdown = (ev: React.FormEvent<HTMLDivElement>,
		option?: IDropdownOption, index?: number
	): void => {
    const { id } = ev.target as HTMLInputElement;
		// console.log('target:', ev.target as HTMLInputElement);
		// console.log('chgDropdown:', id, '\noption:', option);

		if (option) {
			this.setState((prevState) => ({
				...prevState,
				[id]: option
			}));
		}
	}
	private chgDropdownMulti = (ev: React.FormEvent<HTMLDivElement>,
		option?: IDropdownOption, index?: number
	): void => {
    const { id } = ev.target as HTMLInputElement;
		// console.log('target:', ev.target as HTMLInputElement);
		// console.log('chgDropdownMulti:', id, '\noption:', option);

		if (option) {
			const newSelectedItems = option.selected
				? [...this.state.clChoiceCheck, option]
				: this.state.clChoiceCheck.filter(item => item.key !== option.key);

			this.setState(prevState => ({
				...prevState,
				[id]: newSelectedItems
			}));
		}
	}

	private chgDateTimePicker = (someDate: Date | null | undefined, target: string): void => {
		// console.log('TimePicker:', someDate);

		if (someDate) {
			this.setState((prevState) => ({
				...prevState,
				[target]: someDate
			}));
		}
	}

	private chgToggle = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
		// console.log('TogType is:', checked);

    const { id } = ev.target as HTMLInputElement;
		this.setState((prevState) => ({
			...prevState,
			[id]: checked
		}));
	}

	private chgPeoplePicker = async (someEmp: IPersonaProps[], target: string): Promise<void> => {
		// console.log('someEmp:', someEmp);

		try {
			if (!Array.isArray(someEmp) || (!someEmp.length)) return;

			const empId: number[] = [];
			someEmp.map((employee) => {
				empId.push(Number(employee.id) || 0);
			});

			this.setState((prevState) => ({
				...prevState,
				// [target]: someEmp.map((item: IPersonaProps) => item.secondaryText || ''),
				[`${target}Id`]: empId.length === 1 ? empId[0] : empId
			}));
		}
		catch (error) {
			console.error('error:', error);
		}
	}

	// private onFilePickerSave = async (someFile: IFilePickerResult[]): Promise<void> => {
	// 	console.log('someFile:', someFile);
	// 	try {
	// 		if (!Array.isArray(someFile) || (!someFile.length)) return;

	// 		const file = someFile[0];
	// 		this.setState({
	// 			clImage: file.downloadFileContent()
	// 		});
	// 	}
	// 	catch (error) {
	// 		console.error('error:', error);
	// 	}
	// }
	//#endregion


	public render(): React.ReactElement<IFormProps> {
		const { displayMode, itemId, listGuid } = this.props;
		const { Title, isFormDisabled,
			clSingleText, clMultiLinesPlain, clMultiLinesEnhance,
			clChoiceDrop, clChoiceRadio, clChoiceCheck,
			clNumber, clCurrency, clDate, clDateTime,
			clPerson, clPersonGroup, clPersonMulti, clYesNo,
			// clLink, clPicture, clTaskOutcome
		} = this.state;
		// console.log('state:', this.state);

		return (<>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg2'>
					<div className={styles.colX}>Edit-{displayMode}</div>
				</div>
				<div className='ms-Grid-col ms-lg4'>
					<div className={styles.col}>listGuid: {listGuid.toString()}</div>
				</div>
				<div className='ms-Grid-col ms-lg4'>
					<div className={styles.col}>itemId: {itemId}</div>
				</div>
				<div className='ms-Grid-col ms-lg2' />
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg4'>
					<TextField
						id='Title'
						label={'Title'}
						placeholder={'Inscrire le titre'}
						autoFocus
						required
						disabled={isFormDisabled}
						value={Title}
						onChange={this.chgField}
					/>
				</div>
				<div className='ms-Grid-col ms-lg4'>
					<TextField
						id='clSingleText'
						label={'clSingleText'}
						placeholder={'Inscrire la valeur'}
						required
						disabled={isFormDisabled}
						value={clSingleText}
						onChange={this.chgField}
					/>
				</div>
				<div className='ms-Grid-col ms-lg2'>
					<TextField
						type='number'
						id='clNumber'
						label={'clNumber'}
						// className={styles.textQty}
						min={1}
						required
						disabled={isFormDisabled}
						value={clNumber.toString()}
						onChange={this.chgField}
					/>
				</div>
				<div className='ms-Grid-col ms-lg2'>
					<TextField
						type='number'
						id='clCurrency'
						label={'clCurrency'}
						// className={styles.textQty}
						min={1}
						step={0.01}
						required
						disabled={isFormDisabled}
						value={clCurrency.toString()}
						onChange={this.chgField}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg6'>
					<TextField
						id='clMultiLinesPlain'
						label={'clMultiLinesPlain'}
						placeholder={'Inscrire la valeur'}
						multiline
						rows={5}
						required
						disabled={isFormDisabled}
						value={clMultiLinesPlain}
						onChange={this.chgField}
					/>
				</div>
				<div className='ms-Grid-col ms-lg6'>
					<RichText
						id='clMultiLinesEnhance'
						label={'clMultiLinesEnhance'}
						placeholder={'Inscrire la valeur'}
						isEditMode={!isFormDisabled}
						value={clMultiLinesEnhance}
						onChange={(text) => this.chgRichText(text, 'clMultiLinesEnhance')}
						className={isFormDisabled ? styles.disabled : ''}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg4'>
					<Dropdown
						id='clChoiceDrop'
						label={'clChoiceDrop'}
						placeholder={'Select an option'}
						required
						disabled={isFormDisabled}
						options={this.ddOptions.clChoiceDrop}
						selectedKey={clChoiceDrop.key}
						onChange={this.chgDropdown}
					/>
				</div>
				<div className='ms-Grid-col ms-lg4'>
					<Dropdown
						id='clChoiceRadio'
						label={'clChoiceRadio'}
						placeholder={'Select an option'}
						required
						disabled={isFormDisabled}
						options={this.ddOptions.clChoiceRadio}
						selectedKey={clChoiceRadio.key}
						onChange={this.chgDropdown}
					/>
				</div>
				<div className='ms-Grid-col ms-lg4'>
					<Dropdown
						id='clChoiceCheck'
						label={'clChoiceCheck'}
						placeholder={'Select an option'}
						multiSelect
						required
						disabled={isFormDisabled}
						options={this.ddOptions.clChoiceCheck}
						selectedKeys={clChoiceCheck.map((item) => item.key as string)}
						onChange={this.chgDropdownMulti}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg3'>
					<Toggle
						id='clYesNo'
						label={'clYesNo'}
						onText={'Yes'}
						offText={'no'}
						disabled={isFormDisabled}
						checked={clYesNo}
						onChange={this.chgToggle}
					/>
				</div>
				<div className='ms-Grid-col ms-lg3'>
					<DatePicker
						id='clDate'
						label={'clDate'}
						placeholder={'fieldLabel.dpHolder'}
						allowTextInput
						isRequired
						disabled={isFormDisabled}
						strings={DatePickerStrings}
						value={new Date(clDate)}
						formatDate={(someDate) => SaqUtils.formatDate(someDate)}
						onSelectDate={(someDate) => this.chgDateTimePicker(someDate, 'clDate')}
					/>
				</div>
				<div className='ms-Grid-col ms-lg5'>
					<div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr', gridColumnGap: '3px' }}>
						<DatePicker
							id='clDateTime'
							label={'clDateTime'}
							placeholder={'fieldLabel.dpHolder'}
							isMonthPickerVisible={false}
							showGoToToday={false}
							allowTextInput
							isRequired
							disabled={isFormDisabled}
							// strings={DatePickerStrings}
							value={new Date(clDateTime)}
							formatDate={(someDate: Date) => SaqUtils.formatDate(someDate, false)}
							onSelectDate={(someDate) => this.chgDateTimePicker(someDate, 'clDateTime')}
						/>
						<TimePicker
							id='clDateTime-tp'
							label={'Time'}
							placeholder={'fieldLabel.tpHolder'}
							increments={15}
							timeRange={{start: 7, end: 24}}
							disabled={isFormDisabled}
							value={clDateTime}
							onChange={((ev, time) => this.chgDateTimePicker(time, 'clDateTime'))}
						/>
					</div>
				</div>
				<div className='ms-Grid-col ms-lg1' />
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg3'>
					<PeoplePicker
						context={this.peoplePickerContext}
						titleText={'clPerson'}
						placeholder={'Select a person...'}
						ensureUser={true}
						personSelectionLimit={1}
						showtooltip={true}
						required={true}
						disabled={isFormDisabled}
						principalTypes={[PrincipalType.User]}
						defaultSelectedUsers={clPerson}
						onChange={(items) => this.chgPeoplePicker(items, 'clPerson')}
					/>
				</div>
				<div className='ms-Grid-col ms-lg3'>
					<PeoplePicker
						context={this.peoplePickerContext}
						titleText={'clPersonGroup'}
						placeholder={'Select a person...'}
						ensureUser={true}
						personSelectionLimit={1}
						showtooltip={true}
						required={true}
						disabled={isFormDisabled}
						principalTypes={[
							PrincipalType.User, PrincipalType.SharePointGroup,
							PrincipalType.SecurityGroup, PrincipalType.DistributionList
						]}
						defaultSelectedUsers={clPersonGroup}
						onChange={(items) => this.chgPeoplePicker(items, 'clPersonGroup')}
					/>
				</div>
				<div className='ms-Grid-col ms-lg6'>
					<PeoplePicker
						context={this.peoplePickerContext}
						titleText={'clPersonMulti'}
						placeholder={'Select a person...'}
						ensureUser={true}
						personSelectionLimit={10}
						showtooltip={true}
						required={true}
						disabled={isFormDisabled}
						principalTypes={[PrincipalType.User]}
						defaultSelectedUsers={clPersonMulti}
						onChange={(items) => this.chgPeoplePicker(items, 'clPersonMulti')}
					/>
				</div>
			</div>

			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg6'>
					Hey!
				</div>
				<div className='ms-Grid-col ms-lg6'>
					I&apos;m a row!
				</div>
			</div>
		</>);
	}
}
