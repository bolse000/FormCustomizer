import * as React from 'react';

import styles from './FormDEN.module.scss';
import { IEditProps } from './IFormProps';
import { IFormState } from './IFormState';
import { TextField } from '@fluentui/react/lib/TextField';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
// import { CustomListItem } from '../../libApp/IAppHelpers';
// import { SPFI } from '@pnp/sp/fi';
// import { getSP } from '../../../../common/utils/PnpSetup';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DatePickerStrings } from '../../../../common/utils/DatePickerStrings';
import { SaqUtils } from '../../../../common/utils/SaqUtils';
import { TimePicker } from '@fluentui/react/lib/TimePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Toggle } from '@fluentui/react/lib/Toggle';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
// import { Label } from '@fluentui/react/lib/Label';
// import { FieldUrlRenderer } from '@pnp/spfx-controls-react/lib/FieldUrlRenderer';
// import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { UsersInfoGraphSPO } from '../../../../common/services/UsersInfoGraphSPO';


export default class FormEdit extends React.Component<IEditProps, IFormState> {
	// private spFI: SPFI;
	private ddOptions: IDropdownOption[] = [
		{ key: 'Enter Choice #1', text: 'Enter Choice #1' },
		{ key: 'Enter Choice #2', text: 'Enter Choice #2' },
		{ key: 'Enter Choice #3', text: 'Enter Choice #3' }
	];
	private readonly peoplePickerContext = SaqUtils.setPeoplePickerContext(this.props.context);

	constructor(props: IEditProps) {
		super(props);
		// console.log('FormEdit:', props);

		this.state = {
			isFormDisabled: false,

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
			clImage: {
				problemFilePick: undefined,
			},
			clTaskOutcome: { key: '', text: '' }
		};
	}


	//#region Lifecycle
	// Executed after component is rendered
	public async componentDidMount(): Promise<void> {
		console.time('FormEdit');

		await this.setFormItem();
		// if (this.props.displayMode === FormDisplayMode.New) {
		// 	// we're creating a new item so nothing to load
		// 	return Promise.resolve();
		// }

		console.timeEnd('FormEdit');
	}

	// Executed after component is rendered
	public async componentDidUpdate(
		_prevProps: Readonly<IEditProps>, _prevState: Readonly<IFormState>
	): Promise<void> {
    if (_prevState !== this.state) {
      this.props.onStateChange(this.state);
    }
  }

	private setFormItem = async (): Promise<void> => {
		const { listGuid, itemId } = this.props;
		const item = await this.props.getItem(listGuid.toString(), itemId);
		// console.log('loadItem:', item);

		const getMail = async (someId: number): Promise<string[]> => {
			const user = UsersInfoGraphSPO.getUserById(someId);
			const mail = user.then((item) => [item.Email]);
			return mail;
			// return UsersInfoGraphSPO.getUserById(someId);
		};
		const mailPerson = await getMail(item.clPersonId);
		const mailPersonGroup = await getMail(item.clPersonGroupId);
		const mailPersonMulti = await Promise.all(item.clPersonMultiId.map((item) => getMail(item)));

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
			, () => { console.log('setFormItem:', this.state) }
		);
	}
	//#endregion


	//#region Field Change
	private chgTitle = (
		ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, someValue?: string | undefined
	): void => {
		this.setState({ Title: someValue || '' });
	}

	private clSingleText = (
		ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, someValue?: string | undefined
	): void => {
		this.setState({ clSingleText: someValue || '' });
	}

	private clMultiLinesPlain = (
		ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, someValue?: string | undefined
	): void => {
		this.setState({ clMultiLinesPlain: someValue || '' });
	}

	private onSelectDateProblem = (someValue: Date): void => {
		// console.log('DatePicker:', someValue);
		this.setState({ clDate: someValue });
	}

	private chgRichText = (someText: string): string => {
		// console.log('chgRichText:', someText);
		this.setState({ clMultiLinesEnhance: someText });
		return someText;
	}

	private chgField = (
		ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, someValue?: string | undefined
	): void => {
    const { name } = ev.target as HTMLInputElement;
		// console.log('chgField:', name, '\nvalue:', someValue);

		this.setState((prevState) => ({
			...prevState,
			[name]: someValue || ''
		}));
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

	private onTimePicker = (someDate: Date | null | undefined, target: string): void => {
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
		// this.setState({ clYesNo: checked });

    const { id } = ev.target as HTMLInputElement;
		this.setState((prevState) => ({
			...prevState,
			[id]: checked
		}));
	}

	private handlePeoplePicker = async (someEmp: IPersonaProps[], target: string): Promise<void> => {
		// console.log('someEmp:', someEmp);

		try {
			if (!Array.isArray(someEmp) || (!someEmp.length)) return;

			const empId: number[] = [];
			someEmp.map((employee) => {
				empId.push(Number(employee.id) || 0);
			});

			this.setState((prevState) => ({
				...prevState,
				[target]: someEmp.map((item: IPersonaProps) => item.secondaryText || ''),
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


	// private validateForm = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
	// 	ev.preventDefault();
	// 	console.log('props:', this.props);
	// 	try {
	// 		console.log('ev:', this.state);
	// 		// const item = await this.spFI.web.lists.getById(this.props.listGuid).items.add(this.state);
	// 		// console.log('item:', item);
	// 		// this.props.onClose
	// 		await this.saveItem();
	// 		this.props.onClose();
	// 	}
	// 	catch (error) {
	// 		console.error(error);
	// 	}
	// }

	// private saveItem = async (): Promise<void> => {
	// 	console.log('saveItem:', this.props);
	// 	const { Title, clSingleText, clMultiLinesPlain, clMultiLinesEnhance } = this.state;
	// 	const spList = this.spFI.web.lists.getById(this.props.listGuid.toString());
	// 	const item = await spList.items.getById(this.props.itemId).update({
	// 		Title: Title,
	// 		clSingleText: clSingleText,
	// 		clMultiLinesEnhance: clMultiLinesEnhance,
	// 		clMultiLinesPlain: clMultiLinesPlain
	// 	});
	// 	console.log('item:', item);
	// 	// this.props.onClose();
	// }


	public render(): React.ReactElement<IEditProps> {
		const { displayMode, itemId, listGuid } = this.props;
		const {
			isFormDisabled, Title,
			clSingleText, clMultiLinesPlain, clMultiLinesEnhance,
			clChoiceDrop, clChoiceRadio, clChoiceCheck,
			clNumber, clCurrency, clDate, clDateTime,
			clPerson, clPersonGroup, clPersonMulti, clYesNo,
			// clLink, clPicture, clTaskOutcome
		} = this.state;
		// console.log('state:', this.state);

		return (<>
			{/* <form onSubmit={this.validateForm}> */}
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
					<div className='ms-Grid-col ms-lg6'>
						<TextField
							name='Title'
							label={'Title'}
							placeholder={'Inscrire le titre'}
							autoFocus
							required
							value={Title}
							onChange={this.chgField}
							disabled={isFormDisabled}
						/>
					</div>
					<div className='ms-Grid-col ms-lg6'>
						<TextField
							name='clSingleText'
							label={'clSingleText'}
							placeholder={'Inscrire la valeur'}
							required
							value={clSingleText}
							onChange={this.chgField}
							disabled={isFormDisabled}
						/>
					</div>
				</div>
				<div className={styles.row}>
					<div className='ms-Grid-col ms-lg6'>
						<TextField
							name='clMultiLinesPlain'
							label={'clMultiLinesPlain'}
							placeholder={'Inscrire la valeur'}
							required
							multiline
							rows={5}
							value={clMultiLinesPlain}
							onChange={this.chgField}
							disabled={isFormDisabled}
						/>
					</div>
					<div className='ms-Grid-col ms-lg6'>
						<RichText id='clMultiLinesEnhance'
							label={'clMultiLinesEnhance'}
							placeholder={'Inscrire la valeur'}
							value={clMultiLinesEnhance}
							onChange={this.chgRichText}
							isEditMode={!isFormDisabled}
							// style={{ height: '200px' }}
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
							selectedKey={clChoiceDrop.key}
							onChange={this.chgDropdown}
							options={this.ddOptions}
						/>
					</div>
					<div className='ms-Grid-col ms-lg4'>
						<Dropdown
							id='clChoiceRadio'
							label={'clChoiceRadio'}
							placeholder={'Select an option'}
							required
							disabled={isFormDisabled}
							selectedKey={clChoiceRadio.key}
							onChange={this.chgDropdown}
							options={this.ddOptions}
						/>
					</div>
					<div className='ms-Grid-col ms-lg4'>
						<Dropdown
							id='clChoiceCheck'
							label={'clChoiceCheck'}
							placeholder={'Select an option'}
							required
							multiSelect
							disabled={isFormDisabled}
							selectedKeys={clChoiceCheck.map((item) => item.key as string)}
							onChange={this.chgDropdownMulti}
							options={this.ddOptions}
						/>
					</div>
				</div>
				<div className={styles.row}>
					<div className='ms-Grid-col ms-lg2'>
						<TextField
							type='number'
							name='clNumber'
							label={'clNumber'}
							// className={styles.textQty}
							required
							min={1}
							disabled={isFormDisabled}
							value={clNumber.toString()}
							onChange={this.chgField}
						/>
					</div>
					<div className='ms-Grid-col ms-lg2'>
						<TextField
							type='number'
							name='clCurrency'
							label={'clCurrency'}
							// className={styles.textQty}
							required
							min={1}
							step={0.01}
							disabled={isFormDisabled}
							value={clCurrency.toString()}
							onChange={this.chgField}
						/>
					</div>
					<div className='ms-Grid-col ms-lg3'>
						<DatePicker
							label={'clDate'}
							placeholder={'fieldLabel.dpHolder'}
							allowTextInput
							isRequired
							disabled={isFormDisabled}
							strings={DatePickerStrings}
							formatDate={(someDate) => SaqUtils.formatDate(someDate)}
							onSelectDate={(someDate) => this.onTimePicker(someDate, 'clDate')}
							// onSelectDate={this.onSelectDateProblem}
							value={new Date(clDate)}
						/>
					</div>
					<div className='ms-Grid-col ms-lg5'>
						<div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr', gridColumnGap: '3px' }}>
							<DatePicker
								label={'clDateTime'}
								placeholder={'fieldLabel.dpHolder'}
								allowTextInput
								isRequired
								isMonthPickerVisible={false}
								showGoToToday={false}
								disabled={isFormDisabled}
								formatDate={(someDate: Date) => SaqUtils.formatDate(someDate, false)}
								onSelectDate={(someDate) => this.onTimePicker(someDate, 'clDateTime')}
								value={new Date(clDateTime)}
								// style={{ width: '50%' }}
							/>
							<TimePicker
								label={'Time'}
								placeholder={'fieldLabel.tpHolder'}
								increments={15}
								timeRange={{start: 7, end: 24}}
								disabled={isFormDisabled}
								onChange={((ev, time) => this.onTimePicker(time, 'clDateTime'))}
								value={clDateTime}
								// style={{ width: '50%' }}
							/>
						</div>
					</div>
				</div>
				<div className={styles.row}>
					<div className='ms-Grid-col ms-lg2'>
						<Toggle
							id='clYesNo'
							label={'clYesNo'}
							disabled={isFormDisabled}
							onText={'Yes'}
							offText={'no'}
							onChange={this.chgToggle}
							checked={clYesNo}
						/>
					</div>
					<div className='ms-Grid-col ms-lg3'>
						<PeoplePicker
							context={this.peoplePickerContext}
							titleText={'clPerson'}
							placeholder={'Select a person...'}
							disabled={isFormDisabled}
							ensureUser={true}
							personSelectionLimit={1}
							required={true}
							showtooltip={true}
							principalTypes={[PrincipalType.User]}
							defaultSelectedUsers={clPerson}
							onChange={(items) => this.handlePeoplePicker(items, 'clPerson')}
						/>
					</div>
					<div className='ms-Grid-col ms-lg3'>
						<PeoplePicker
							context={this.peoplePickerContext}
							titleText={'clPersonGroup'}
							placeholder={'Select a person...'}
							disabled={isFormDisabled}
							ensureUser={true}
							personSelectionLimit={1}
							required={true}
							showtooltip={true}
							principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup, PrincipalType.SecurityGroup, PrincipalType.DistributionList]}
							defaultSelectedUsers={clPersonGroup}
							onChange={(items) => this.handlePeoplePicker(items, 'clPersonGroup')}
						/>
					</div>
					<div className='ms-Grid-col ms-lg4'>
						<PeoplePicker
							context={this.peoplePickerContext}
							titleText={'clPersonMulti'}
							placeholder={'Select a person...'}
							disabled={isFormDisabled}
							ensureUser={true}
							personSelectionLimit={10}
							required={true}
							showtooltip={true}
							principalTypes={[PrincipalType.User]}
							defaultSelectedUsers={clPersonMulti}
							onChange={(items) => this.handlePeoplePicker(items, 'clPersonMulti')}
						/>
					</div>
					{/* <div className='ms-Grid-col ms-lg1' /> */}
				</div>

				<div className={styles.row}>
					<div className='ms-Grid-col ms-lg6'>
						Hey!
					</div>
					<div className='ms-Grid-col ms-lg6'>
						I&apos;m a row!
					</div>
				</div>
			{/* </form> */}
		</>);
	}
}
