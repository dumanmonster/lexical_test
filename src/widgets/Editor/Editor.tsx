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
import * as postcssValueParser from "tailwindcss/src/value-parser";

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
interface IEditor {
    initialState: string | null;
    handleChange: (data: string) => void;
}

export const Editor: FC<IEditor> = ({initialState, handleChange}) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true)
    }, [initialState]);

    const onChange = (editorState) => {
        const editorStateJSON = editorState.toJSON();

        handleChange(JSON.stringify(editorStateJSON));
    }



    return (
        <>
            {isLoaded ?
            <LexicalComposer initialConfig={{...editorConfig, editorState: initialState}}>
                <div className="w-full flex justify-center py-6 ">
                    <div className={'w-1/3 flex flex-col bg-white rounded-2xl'}>
                            <ToolbarPlugin/>


                            <RichTextPlugin
                                contentEditable={<ContentEditable
                                    className="editor-input border-t-2-[#000000]"/>}
                                placeholder={<Placeholder/>}
                                ErrorBoundary={LexicalErrorBoundary}
                            />

                            <AutoFocusPlugin/>
                            <MyOnChangePlugin onChange={onChange}/>
                            <ImagesPlugin/>

                    </div>





                </div>


            </LexicalComposer> : <div>Loading ...</div>}
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


export const View = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [editorState, setEditorState] = useState<string | null>(null);
    const [searchParams, _] = useSearchParams();
    const topic_id = searchParams.get('topic_id');
    useEffect(() => {

        if (topic_id) {
            const state = localStorage.getItem(topic_id);
            setEditorState(state)
            setIsLoaded(true)
        }


    }, []);

    return (
        <>
            {isLoaded ?
            <LexicalComposer initialConfig={{...editorConfig, editorState: editorState, editable: false}}>
                <div className="w-full flex justify-center py-6">


                    <RichTextPlugin
                        contentEditable={<ContentEditable className={'editor-input w-1/3 bg-white rounded-2xl p-5'}
                        />}       placeholder={(isEditable) => isEditable ? <Placeholder/> : null}
                        ErrorBoundary={LexicalErrorBoundary}
                    />

                    <AutoFocusPlugin/>
                    <ImagesPlugin/>

                </div>


            </LexicalComposer>
            : <div>Loading ...</div>
        }
        </>


    )

}