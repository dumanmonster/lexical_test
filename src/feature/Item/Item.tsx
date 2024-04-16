 import {DataType} from "../../types";
import {FC, Fragment, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Carousel} from "../Carousel";
import {EditorTheme, mockData} from "../../constants";
import {Editor, View} from "../../widgets";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import ImagesPlugin from "../ImagesPlugin/ImagesPlugin.ts";
import {ImageNode} from "../ImagesPlugin/nodes/ImageNode.tsx";

interface IItem {
    data: DataType;
}

function findImages(obj: any, imagesArray: any[]) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            findImages(obj[i], imagesArray);
        }
    } else if (typeof obj === 'object') {
        if (obj?.type === 'image' && obj?.src) {
            imagesArray.push(obj);
        }
        for (let key in obj) {
            findImages(obj[key], imagesArray);
        }
    }
}

export const Item: FC<IItem> = ({data}) => {

    const [_, setSearchParams] = useSearchParams();
    const [images, setImages] = useState<any[]>([]);

    const handleOpen = () => {
        setSearchParams({topic_id: String(data.id)})
    }

    const editorState = localStorage.getItem(String(data.id))

    useEffect(() => {
        if (editorState) {
            const editorRoot = JSON.parse(editorState)
            const images: any[] = [];
            findImages(editorRoot.root, images);
            setImages(images)
        }

    }, [editorState]);


    return (
        <div className={'w-full p-4 rounded-2xl bg-white flex flex-col gap-1  shrink-0 '}>
            <h3 className={'text-wrap text-left text-[#030303] text-lg '}>{data.title}</h3>
            <p className={'truncate text-left text-[#678ca1] text-xs'}>{data.description}</p>

            <div className={'flex-grow relative'}>
                <ItemQuickView data={data}/>
            </div>
            <div className={'w-full flex justify-end'}>
                <button
                    className={' bg-[#55baf0] text-white font-bold py-3 px-4 border-b-4 border-[#0c658d]  rounded-2xl uppercase text-sm'}
                    onClick={handleOpen}>Подробнее
                </button>

            </div>


        </div>
    )
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
const ItemQuickView: FC<IItem> = ({data}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const editorState = localStorage.getItem(String(data.id));
    useEffect(() => {
        setIsLoaded(true)
    }, [data]);
    const [className, setClassName] = useState('max-h-12 overflow-hidden')

    const handleChangeClassName = () => {
        setClassName(prev => {
            return prev.length ? '' : 'max-h-12 overflow-hidden'
        })
    }


    return (
        <Fragment key={editorState}>
            {isLoaded ?
                <LexicalComposer initialConfig={{...editorConfig, editorState: editorState, editable: false}}>



                        <RichTextPlugin
                            contentEditable={<ContentEditable className={`text-sm w-full bg-white  ${className}`}
                            />}       placeholder={ null}
                            ErrorBoundary={LexicalErrorBoundary}
                        />

                        <AutoFocusPlugin/>
                        <ImagesPlugin/>



                </LexicalComposer>
                : <div>Loading ...</div>
            }
            <button className={'text-sky-300 hover:text-sky-500 text-sm absolute left-0'} onClick={handleChangeClassName}>{className.length ? 'см.еще' : 'скрыть'}</button>

            {editorState ? <button className={'text-sky-300 hover:text-sky-500 text-sm absolute left-0'} onClick={handleChangeClassName}>{className.length ? 'см.еще' : 'скрыть'}</button>  : null}

        </Fragment>
    )
}

export const FullItem = () => {
    const topic_id = new URLSearchParams(location.search).get('topic_id');
    const [searchParams, setSearchParams] = useSearchParams();

    const currTopic = mockData.find((d) => String(d.id) === topic_id)
    const [editorState, setEditorState] = useState<string | null>(null);

    const handleChangeState = (data: string) => {
        setEditorState(data)
    }
    const saveNodeState = () => {
       localStorage.setItem(String(topic_id), editorState)
    }
    const handleClose = () => {
        setSearchParams((params) => {
            params.delete('topic_id')
            return params
        })
    }

    const [mode, setMode] = useState<'view'| 'edit'>('view');

    const handleChangeMode = () => {
        if(mode === 'edit'){
            saveNodeState()
        }
        setMode((prevState) => {
            return prevState === 'view' ? 'edit' : 'view';
        })
    }
    useEffect(() => {
        if(localStorage.getItem(String(topic_id))){
            setEditorState(localStorage.getItem(String(topic_id)))
        }




    }, []);
    return (
        <>
            <div className={'w-full bg-white fixed  h-16 flex  px-5 py-2 z-20'}>
                <button onClick={handleClose}>
                    <svg className={'stroke-2 w-6 h-6 '} xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" stroke="#678ca1">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>

                </button>
                <div className={'w-1/2 ml-20 '}>
                    <h3 className={'text-wrap text-left text-[#030303] text-lg '}>{currTopic?.title}</h3>
                    <p className={'truncate text-left text-[#678ca1] text-xs'}>{currTopic?.description}</p>
                </div>
                <button onClick={handleChangeMode} className={'ml-auto bg-[#55baf0] text-white rounded-2xl px-3 text-sm'}>
                    {mode === 'view' ? 'Редактировать' : 'Сохранить'}
                </button>
            </div>
            <div className={'flex-grow w-full pt-16'}>
                {mode === 'view' ? <View /> : <Editor initialState={editorState} handleChange={handleChangeState}/>}
            </div>
        </>

    )
}