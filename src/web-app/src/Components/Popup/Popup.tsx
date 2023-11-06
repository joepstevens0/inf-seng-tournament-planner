import React from 'react'
import styles from './Popup.module.css'

function Popup(props: any) {

    /**
     * Called when the popup needs to close
     * @post onClose prop function is called
     */
    function onClose(){
        if (props.onClose !== undefined)
            props.onClose();
    }

    /**
     * get the class for the visibility of the popup
     * @returns classname hidden or visible depended of the <hidden> prop
     */
    function visiblityClass(): any{
        if (props.hidden !== undefined){
            if (props.hidden) return styles.hidden;
            return styles.visible;
        }
        
        return styles.hidden;
    }

    return (
        <div className={styles.popup+ " "+  visiblityClass()}>
            <div className={styles.mask} onClick={onClose}></div>
            <div className={styles.popupcontainer}>
                <h1 className={styles.title}>{props.title}</h1>
                <div className={styles.popupcontent} >{props.children}</div>
            </div>
        </div>
    );

}

export default Popup;