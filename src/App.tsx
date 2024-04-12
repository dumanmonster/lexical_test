import './App.css'
import {mockData} from "./constants";
import {Item} from "./feature/Item";
import {useLocation, useSearchParams} from "react-router-dom";
import {Editor} from "./widgets";
import {data} from "autoprefixer";

function App() {
    const location = useLocation();

    // Get a specific query parameter
    const topic_id = new URLSearchParams(location.search).get('topic_id');


    return (
        <div className={'contain-content py-2 w-full flex justify-center h-full'} >
            <div className={'flex flex-col gap-8 w-1/3 overflow-auto h-full'}>
                {mockData?.map((item) => {

                    return (<Item data={item} key={item.id}/>)
                    })}
                </div>

            {!!topic_id?.length && (
                <div className={'w-full absolute z-20  h-full bg-white flex justify-center align-middle'} >

                    <div className={'w-1/2 h-64'}>
                        <Editor />
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
