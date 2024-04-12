import {FC, useEffect, useState} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {EditorTheme} from "../../constants";
import {ToolbarPlugin} from "../../feature/ToolbarPlugin";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {ImageNode} from "../../feature/ImagesPlugin/nodes/ImageNode.tsx";
import ImagesPlugin from "../../feature/ImagesPlugin/ImagesPlugin.ts";
import {useSearchParams} from "react-router-dom";

function Placeholder() {
    return <div className="editor-placeholder">Введите текст ...</div>;
}

const editorConfig = {
    namespace: 'Test Task',
    // Handling of errors during update
    onError(error: Error) {
        throw error;
    },
    // The editor theme
    theme: EditorTheme,
    nodes: [ImageNode]

};


export const Editor: FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [editorState, setEditorState] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const topic_id = searchParams.get('topic_id');
    useEffect(() => {

        if(topic_id){
            const state =   localStorage.getItem(topic_id);
            setEditorState(state)
            setIsLoaded(true)
        }



    }, []);


    const onChange = (editorState) => {
        const editorStateJSON = editorState.toJSON();

        setEditorState(JSON.stringify(editorStateJSON));
    }

    const handleSaveText = () => {

        if (editorState && topic_id) {
            localStorage.setItem(topic_id, editorState)
        }


    }
    const handleClose = () => {
        setSearchParams((params) => {
            params.delete('topic_id')
            return params
        })
    }

    return (
        <>
            {isLoaded ?     <LexicalComposer initialConfig={{  ...editorConfig, editorState: editorState}} >
                <div className="w-full border-slate-400 border-2 rounded">
                    <ToolbarPlugin/>

                    <div className={'border-slate-400  border-t-2 relative'}>
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="editor-input h-96 max-h-96 min-h-96 overflow-auto"/>}
                            placeholder={<Placeholder/>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />

                        <AutoFocusPlugin/>
                        <MyOnChangePlugin onChange={onChange}/>
                        <ImagesPlugin/>
                    </div>

                    <div className={'border-slate-400 border-t-2 p-2 flex justify-between'}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
                                onClick={handleClose}>
                            Назад
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
                                onClick={handleSaveText}>
                            Сохранить
                        </button>
                    </div>


                </div>


            </LexicalComposer> : <div>Loading...</div>}
        </>

    );
}

function MyOnChangePlugin({onChange}) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}