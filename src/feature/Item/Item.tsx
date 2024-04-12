import {DataType} from "../../types";
import {FC, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Carousel} from "../Carousel";

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
        if(editorState){
            const editorRoot = JSON.parse(editorState)
            const images: any[] = [];
            findImages(editorRoot.root, images);
            setImages(images)
        }

    }, [editorState]);


    return (
        <div className={'w-full p-4 rounded-2xl bg-slate-300 flex flex-col gap-1  shrink-0 '}>
            <h3 className={'text-wrap text-left text-slate-600 text-lg '}>{data.title}</h3>
            <p className={'truncate text-left text-slate-500 text-xs'}>{data.description}</p>
            <div className={'flex-grow h-48 flex justify-center'}>
                <Carousel images={images} />


            </div>
            <div className={'w-full flex justify-end'}>
                <button className={' w-1/4 bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 border-b-4 border-slate-700 hover:border-slate-500 rounded-2xl'} onClick={handleOpen}>Подробнее</button>

            </div>


        </div>
    )
}