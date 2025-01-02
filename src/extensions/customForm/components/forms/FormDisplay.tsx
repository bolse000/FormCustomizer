import * as React from 'react';

import styles from './FormDEN.module.scss';
import { IFormProps } from './IFormProps';
import { IFormState } from './IFormState';
// import { DynamicForm } from '@pnp/spfx-controls-react/lib/DynamicForm';


export default class FormDisplay extends React.Component<IFormProps, IFormState> {

	constructor(props: IFormProps) {
		super(props);
		console.log('FormDisplay:', props);

		// this.state = {
		// 	isFormDisabled: false,

		// 	Title: '',
		// 	clSingleText: '',
		// 	clMultiLinesEnhance: '',
		// 	clMultiLinesPlain: '',

		// 	clChoiceDrop: { key: '', text: '' },
		// 	clChoiceRadio: { key: '', text: '' },
		// 	clChoiceCheck: { key: '', text: '' },
		// };
	}

	public render(): React.ReactElement<IFormProps> {
		const { displayMode, itemId, listGuid } = this.props;
		return (<>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg10'>
					<div className={styles.colX}>Display-{displayMode}</div>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg10'>
					<div className={styles.col}>listGuid: {listGuid.toString()}</div>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg10'>
					<div className={styles.col}>itemId: {itemId}</div>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg10'>
					{/* <DynamicForm
						context={this.props.context}
						listId={listGuid.toString()}
						listItemId={itemId}
						onCancelled={this.props.onClose}
					/> */}
				</div>
			</div>
		</>);
	}
}
