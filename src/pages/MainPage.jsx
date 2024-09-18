import React, { useState } from "react";
import { Search, MoveLeft, Loader } from "lucide-react";
import axios from "axios";
import Card from "../components/Card";

const MainPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDataRetrieval = async(value) => {
        if (value) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://backend.cappsule.co.in/api/v1/new_search?q=${value}&pharmacyIds=1,2,3`);
                setData(response.data.data.saltSuggestions);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("An error occurred while fetching data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        setInputValue("");
        setData([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleDataRetrieval(inputValue);
    };

    return (
        <section className="flex flex-col items-center justify-center w-full gap-10">
            <section className="mt-14 flex flex-col items-center justify-center gap-10 w-full">
                <h1 className="text-3xl font-semibold text-gray-600">Cappsule web development test</h1>
                <form onSubmit={handleSubmit} className="w-[93%] sm:w-[80%] md:w-[70%] flex items-center justify-center relative">
                    {inputValue ? (
                        <MoveLeft className="absolute left-4 stroke-2 text-center cursor-pointer" onClick={handleBack} />
                    ) : (
                        <Search className="absolute left-4 stroke-1 cursor-pointer" />
                    )}
                    <input 
                        name="search"
                        type="text" 
                        id="search" 
                        placeholder="Type your medicine name here"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full pl-16 pr-24 py-3 rounded-full shadow-2xl focus:outline-none text-md font-semibold text-gray-700"
                    />
                    <button type="submit" className="absolute right-4 text-md font-semibold text-sky-500">
                        Search
                    </button>
                </form>
                <hr className="h-0.5 bg-gray-300 w-[95%] sm:w-[82%] md:w-[72%]" />
            </section>
            <section className="w-[93%] sm:w-[80%] md:w-[70%] flex flex-col items-center justify-center gap-5">
                {isLoading ? (
                    <div className="flex items-center justify-center mt-32 mb-32">
                        <Loader className="animate-spin h-10 w-10 text-gray-500" />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center mt-32 mb-32">{error}</p>
                ) : data.length === 0 ? (
                    <h1 className="text-gray-400 text-center mt-32 text-xl font-bold mb-32">
                        "Find medicines with amazing discount"
                    </h1>
                ) : (
                    data.map((d, index) => <Card key={index} data={d} />)
                )}
            </section>
        </section>
    );
};

export default MainPage;