import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CkEditor=(props)=>{

    const handleChange = (editor) => {
        if (editor) {
            if (editor.getData() !== props.value) {
                props.onChange(editor.getData());

            }
        }
    };


    return (
        <div style={{minHeight:300}}>
                <CKEditor
                    editor={ ClassicEditor }
                    config={ {
                        ckfinder: {
                            // Upload the images to the server using the CKFinder QuickUpload command.
                            uploadUrl: props.uploadUrl,
                            baseUrl: props.baseUrl,
                        },
                        toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                            'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo'],
                    } }
                    data={props.value ? props.value : ''}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor1 is ready to use!', editor );
                        editor.editing.view.change((writer) => {
                            writer.setStyle(
                                "height",
                                "300px",
                                editor.editing.view.document.getRoot()
                            );
                        });
                    } }
                    onChange={(_event, editor) => {
                        const data = editor.getData();
                        handleChange(editor);
                    }}
                />
        </div>
    );
}

export default CkEditor
