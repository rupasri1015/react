import React from 'react';
import { size } from 'lodash';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from './styles.module.scss';

const MMVQuantityDialog = (props) => {
  const { data, isOpen, onClose } = props;

  if (!size(data)) return null;

  // Manipulating data to display heading & add heading only when there is no header set
  if (data.mmvQuantityList.length && data.mmvQuantityList[0].quantity !== 'Quantity') {
    data.mmvQuantityList.unshift({ mmv: ['MMV'], quantity: 'Quantity'});
  }

  const renderSection = ({ label, slug }) => {
    const categoryStyle = slug === 'category' ? { flex: '2' } : {};
    return (
      <div className={styles.headerSection} style={categoryStyle}>
        <div className={styles.headerLabel}>{label}</div>
        <div>{data[slug]}</div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        {renderSection({ label: 'Section', slug: 'section' })}
        {renderSection({ label: 'Category', slug: 'category' })}
        {renderSection({ label: 'Part Name', slug: 'sparePartName' })}
      </div>
    );
  };

  const renderMMVs = (mmvs) => {
    return mmvs.map((item, index) => {
      return <span>{item}</span>;
    });
  };

  const renderData = () => {
    return data.mmvQuantityList.map((item, index) => {
      return (
        <div className={styles.item}>
          <div className={styles.mmvsList}>{renderMMVs(item.mmv)}</div>
          <div>{item.quantity}</div>
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        MMV Distribution{' '}
        <span
          className="float-right"
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        >
          &#10005;
        </span>
      </DialogTitle>
      <DialogContent>
        {renderHeader()}
        <div className={styles.itemsContainer}>{renderData()}</div>
      </DialogContent>
      <DialogActions>
        <button className="icon-btn" onClick={onClose}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default MMVQuantityDialog;
