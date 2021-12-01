import styles from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';


const Modal = ({ children, modalState, modalType = null, modalClose = null }) => {

    return (
        <>
            <Backdrop modalState={modalState} clicked={modalClose} />
            <div 
                className={
                    modalType && modalType === 'PostModal' ? 
                    `${styles.Modal} ${styles.PostModal}` :
                    `${styles.Modal}`
                }
                style={{
                    display: modalState ? 'inline-grid' : 'none'
                }}>
                {children}
            </div>
        </>
    );
};

export default Modal;