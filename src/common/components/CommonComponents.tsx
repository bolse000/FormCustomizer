import * as React from 'react';
import { ShimmerElementsGroup, ShimmerElementType } from '@fluentui/react/lib/Shimmer';

import styles from './CommonCompo.module.scss';


export const ShimmerElmsGrp = (nbrTime?: number): React.ReactElement[] => {
	const retEl: JSX.Element[] = [];

	if (nbrTime === null || nbrTime === undefined) {
		nbrTime = 1;
	}

	for (let x = 0; x < nbrTime; x++) {
		retEl.push(
			<div>
				<div className={styles.shimmerRoot}>
					<ShimmerElementsGroup
						width={'90px'}
						shimmerElements={[
							{ type: ShimmerElementType.line, height: 80, width: 80 },
							{ type: ShimmerElementType.gap, width: 10, height: 80 }
						]}
					/>
					<div className={styles.shimmerElements}>
						<ShimmerElementsGroup
							shimmerElements={[
								{ type: ShimmerElementType.circle, height: 40 },
								{ type: ShimmerElementType.gap, width: 10, height: 40 }]}
						/>
						<ShimmerElementsGroup
							flexWrap={true}
							width={'calc(100% - 50px)'}
							shimmerElements={[
								{ type: ShimmerElementType.line, width: '90%', height: 10 },
								{ type: ShimmerElementType.gap, width: '10%', height: 20 },
								{ type: ShimmerElementType.line, width: '100%', height: 10 }
							]}
						/>
						<ShimmerElementsGroup
							flexWrap={true}
							width={'100%'}
							shimmerElements={[
								{ type: ShimmerElementType.line, width: '80%', height: 10, verticalAlign: 'bottom' },
								{ type: ShimmerElementType.gap, width: '20%', height: 20 },
								{ type: ShimmerElementType.line, width: '40%', height: 10, verticalAlign: 'bottom' },
								{ type: ShimmerElementType.gap, width: '2%', height: 20 },
								{ type: ShimmerElementType.line, width: '58%', height: 10, verticalAlign: 'bottom' }
							]}
						/>
					</div>
				</div>
				<ShimmerElementsGroup
					flexWrap={true}
					width={'100%'}
					shimmerElements={[
						{ type: ShimmerElementType.gap, width: '100%', height: 20 }
					]}
				/>
			</div>
		);
	}

	return retEl;
};

export const DemoRow = (): JSX.Element => {
	return (
		<>
			<hr />
			<div className={styles.demoRow}>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>1</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>2</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>3</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>4</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>5</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>6</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>7</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>8</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>9</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>10</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>11</div>
				<div className={`ms-Grid-col ms-lg1 ${styles.demoBlock}`}>12</div>
			</div>
		</>
	);
};
