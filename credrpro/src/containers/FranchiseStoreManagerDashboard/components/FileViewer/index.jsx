import React, { useState } from 'react';

import crossIcon from '../../../../shared/img/icons/close-black.svg';
import removeIcon from '../../../../shared/img/icons/ic_remove_white.svg';

import documentIcon from '../../../../shared/img/icons/document-qc-icon.svg';

import styles from './styles.module.scss';

const FileViewer = (props) => {
	const { files, onRemoveClick } = props;
	const [imageError, setImageError] = useState(false);

	const getFileThumbnails = (item, index) => {
		if (item.type.includes('image'))
			return (
				<div key={index} className="col-sm-2">
					{!imageError && (
						<div className={styles.imageOuter}>
							<img
								style={{ height: '60px', position: 'relative' }}
								src={URL.createObjectURL(item)}
								alt={item.name}
								onError={() => setImageError(true)}
							/>
							<img
								style={{ height: '20px', width: '20px' }}
								className={styles.removeIcon}
								src={removeIcon}
								alt={'remove'}
								onClick={() => onRemoveClick({ item, index })}
							/>
						</div>
					)}
					{imageError && <img style={{ height: '60px' }} src={crossIcon} alt={item.name} />}
					<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
				</div>
			);
		if (item.type.includes('pdf'))
			return (
				<div key={index} className="col-sm-2">
					<div className={styles.imageOuter}>
						<img style={{ height: '60px' }} src={documentIcon} alt={item.name} />

						<img
							style={{ height: '20px', width: '20px' }}
							className={styles.removeIcon}
							src={removeIcon}
							alt={'remove'}
							onClick={() => onRemoveClick({ item, index })}
						/>
					</div>
					<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
				</div>
			);
	};

	return (
		<div className="container-fluid">
			<div className="row">{files.map((item, index) => getFileThumbnails(item, index))}</div>
		</div>
	);
};

export default FileViewer;
