import * as React from 'react';

import styles from './FormDEN.module.scss';
import { IFormProps } from './IFormProps';
import { IFormState } from './IFormState';


export default class FormNew extends React.Component<IFormProps, IFormState> {

	constructor(props: IFormProps) {
		super(props);
		console.log('FormNew:', props);

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
		const { displayMode, listGuid } = this.props;
		return (<>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg10'>
					<div className={styles.colX}>New-{displayMode}</div>
				</div>
			</div>
			<div className={styles.row}>
				<div className='ms-Grid-col ms-lg10'>
					<div className={styles.col}>listGuid: {listGuid.toString()}</div>
				</div>
			</div>
		</>);
	}
}
