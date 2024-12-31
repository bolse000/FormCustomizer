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
import { min } from 'lodash';


export default class FormEdit extends React.Component<IEditProps, IFormState> {
	// private spFI: SPFI;
	private ddOptions: IDropdownOption[] = [
		{ key: 'Enter Choice #1', text: 'Enter Choice #1' },
		{ key: 'Enter Choice #2', text: 'Enter Choice #2' },
		{ key: 'Enter Choice #3', text: 'Enter Choice #3' }
	];

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
			clPerson: '',
			clPersonGroup: '',
			clPersonMulti: [],
			clLink: '',
			clPicture: '',
			clImage: '',
			clTaskOutcome: { key: '', text: '' }

			// childState: {}
		};

		// this.spFI = getSP();
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

	private setFormItem = async (): Promise<void> => {
		const { listGuid, itemId } = this.props;
		// const item: CustomListItem = await this.props.dataProvider.getItem(listGuid.toString(), itemId);
		const item = await this.props.getItem(listGuid.toString(), itemId);
		// console.log('loadItem:', item);

		this.setState({
			Title: item.Title,
			clSingleText: item.clSingleText,
			clMultiLinesEnhance: item.clMultiLinesEnhance,
			clMultiLinesPlain: item.clMultiLinesPlain,
			clChoiceDrop: { key: item.clChoiceDrop, text: item.clChoiceDrop },
			clChoiceRadio: { key: item.clChoiceRadio, text: item.clChoiceRadio },
			clChoiceCheck: item.clChoiceCheck.map((item) => ({ key: item, text: item }))
		});
	}


	public render(): React.ReactElement<IEditProps> {
		const { displayMode, itemId, listGuid } = this.props;
		const {
			isFormDisabled, Title,
			clSingleText, clMultiLinesPlain, clMultiLinesEnhance,
			clChoiceDrop, clChoiceRadio, clChoiceCheck
		} = this.state;

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
					<div className='ms-Grid-col ms-lg6'>
						<TextField
							type='number'
							label={'clNumber'}
							// className={styles.textQty}
							required
							min={1}
							// value={productQuantity}
							// onChange={this.chgProductQty}
						/>
					</div>
					<div className='ms-Grid-col ms-lg6'>
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
			{/* </form> */}
		</>);
	}
}
