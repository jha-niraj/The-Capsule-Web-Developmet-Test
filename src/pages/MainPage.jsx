import { Search, MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

const MainPage = () => {
    const [  inputValue, setInputValue] = useState("");
    const [ debouncedValue, setDebouncedValue ] = useState("");

    const [ data, setData ] = useState([]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 500)
        return () => clearTimeout(timerId);
    }, [inputValue])

    const handleBack = () => {
        setInputValue("");
    }
    
    useEffect(() => {
        
    }, [data])

    const handleDataRetrieval = async () => {
        if(debouncedValue) {
        const response = await axios.get("https://backend.cappsule.co.in/api/v1/new_search?q=" + debouncedValue +"&pharmacyIds=1,2,3");
        setData(response.data.data.saltSuggestions);
        }
    }

    return (
        <section className="flex flex-col items-center justify-center w-full gap-10">
            <section className="mt-14 flex flex-col items-center justify-center gap-10 w-full">
                <h1 className="text-3xl font-semibold text-gray-600">Cappsule web development test</h1>
                <div className="w-[93%] sm:w-[80%] md:-[70%] flex items-center justify-center">
                    {
                        inputValue ? <MoveLeft className="relative left-14 stroke-2 text-center cursor-pointer" onClick={handleBack} /> : <Search className="relative left-14 stroke-1 cursor-pointer" />
                    }
                    <input 
                            name="search"
                            type="text" 
                            id="search" 
                            placeholder="Type your medicine name here"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-16 p-8 h-10 rounded-full shadow-2xl focus:outline-none flex items-center justify-center text-md font-semibold text-gray-700"
                    />
                    <button className="text-md font-semibold text-sky-500 relative right-20" onClick={handleDataRetrieval}>Search</button>
                </div>
                <hr className="h-0.5 bg-gray-300 w-[95%] sm:w-[82%] md:-[72%]" />
            </section>
            <section className="w-[93%] sm:w-[80%] md:-[70%] flex flex-col items-center justify-center gap-5">
                {
                    !inputValue ? <h1 className="text-gray-400 text-center mt-32 text-xl font-bold mb-32">"Find medicines with amazing discount"</h1> : 
                        data.length > 0 && data.map((d, index) => {
                            return <Card key={index} data={d} />
                        })
                }
            </section>
        </section>
    )
}

export default MainPage;