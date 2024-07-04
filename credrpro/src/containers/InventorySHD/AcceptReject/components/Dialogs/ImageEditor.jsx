import React, { useEffect, useRef, useState } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import './toastUI.scss'
import { uploadMultiImages } from '../../../../../../src/core/services/documentQcServices'

export default function ImageEditorDialog({ isImageOpen, closeDrawer, closeModal, img, currentIndex, handleEnhancedImages, uploadImage }) {

    let subImgUrl = img.replace('https', process.env.NODE_ENV === 'development' ? 'http' : 'https')
    const [bottomVal, setBottomVal] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [index, setIndex] = useState(currentIndex)
    const imageEditor = React.createRef();
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setBottomVal(...bottomVal, { [anchor]: open });
    };

    const toggleDrawerCheck = () => {
        closeModal()
        setBottomVal(false)
    }

    const dataURItoBlob = (dataURI) => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    const handleSaveImages = () => {
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const data = imageEditorInst.toDataURL();
        if (data) {
            let blob = dataURItoBlob(data);
            let fd = new FormData(document.forms[0]);
            fd.append("file", blob);
            uploadImage(fd)
            // uploadMultiImages(fd)
            //     .then(apires => {
            //         if (apires.isValid) {
            //             setImageSrc(apires.urls)
            //             console.log(imageSrc,"imageSrc")
            //             setIndex(currentIndex)
            //             handleEnhancedImages(apires.urls, currentIndex)
            //         }
            //     })
        }
    };

    const list = (anchor) => (
        <>
            <div className='tui-image-editor-header-buttons'>
                <button className='tui-image-editor-download-btn closeBtn' onClick={()=>{closeModal()}} >Close</button>

                <button className='tui-image-editor-download-btn saveBtn' onClick={handleSaveImages} >Save</button>
            </div>
            <ImageEditor
                includeUI={{
                    loadImage: {
                        path: subImgUrl,
                        name: 'SampleImage'
                    },
                    // theme: blackTheme,
                    menu: ['shape', 'filter', 'crop', 'rotate', 'draw',],
                    initMenu: 'filter',
                    uiSize: {
                        width: '100%',
                        height: '700px'
                    },
                    menuBarPosition: 'bottom',
                }}
                cssMaxHeight={424}
                cssMaxWidth={1000}
                selectionStyle={{
                    cornerSize: 20,
                    rotatingPointOffset: 70,
                }}
                
                usageStatistics={true}
                ref={imageEditor}
            >
            </ImageEditor>
        </>
    );

    return (
        <>
            {
                isImageOpen &&
                <SwipeableDrawer
                    anchor='bottom'
                    open={isImageOpen}
                    onClose={toggleDrawerCheck}
                    onOpen={toggleDrawerCheck}
                >
                    {list('bottom')}
                </SwipeableDrawer>
            }
        </>
    );
}