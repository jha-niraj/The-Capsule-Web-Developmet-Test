import { useState, useEffect } from "react";

const Card = ({ data }) => {
    const [ selectedForm, setSelectedForm ] = useState(null);
    const [ selectedStrength, setSelectedStrength ] = useState(null);
    const [ selectedPackage, setSelectedPackage ] = useState(null);
    const [ minSellingPrice, setMinSellingPrice ] = useState(null);

    useEffect(() => {
        const defaultForm = Object.keys(data.salt_forms_json)[0];
        setSelectedForm(defaultForm);
        const defaultStrength = Object.keys(data.salt_forms_json[defaultForm])[0];
        setSelectedStrength(defaultStrength);
        const defaultPackage = Object.keys(data.salt_forms_json[defaultForm][defaultStrength])[0];
        setSelectedPackage(defaultPackage);
        setMinSellingPrice(getMinSellingPrice(data.salt_forms_json[defaultForm][defaultStrength][defaultPackage]));
    }, [])

    const handleStrengthData = (form) => {
        setSelectedForm(form);
        if(data && data.salt_forms_json && data.salt_forms_json[form]) {
            const defaultStrength = Object.keys(data.salt_forms_json[form])[0];
            setSelectedStrength(defaultStrength);
            const defaultPackage = Object.keys(data.salt_forms_json[form][defaultStrength])[0];
            setSelectedPackage(defaultPackage);
            setMinSellingPrice(getMinSellingPrice(data.salt_forms_json[form][defaultStrength][defaultPackage]));
        } else {
            setSelectedStrength(null);
            setSelectedPackage(null);
            setMinSellingPrice(null);
        }
    }
    const handlePackagingData = (strength) => {
        setSelectedStrength(strength);
    }
    const showPackagingData = (packageName) => {
        setSelectedPackage(packageName);
        setMinSellingPrice(getMinSellingPrice(data.salt_forms_json[selectedForm][selectedStrength][packageName]));
    }

    const getMinSellingPrice = (packageData) => {
        let minPrice = Infinity;
        for (const key in packageData) {
            if (Array.isArray(packageData[key])) {
                for (const item of packageData[key]) {
                    if (item.selling_price < minPrice) {
                        minPrice = item.selling_price;
                    }
                }
            }
        }
        return minPrice === Infinity ? null : minPrice;
    };

    const getBorderStyle = (form, strength, packageKey) => {
        if (packageKey && data.salt_forms_json[form] && data.salt_forms_json[form][strength] && data.salt_forms_json[form][strength][packageKey]) {
            const hasSellingPrice = getMinSellingPrice(data.salt_forms_json[form][strength][packageKey]) !== null;
            return hasSellingPrice ? '5px solid black' : '3px dashed black';
        }
        return '';
    };
    const getStrengthBorderStyle = (form, strength) => {
        if (strength && data.salt_forms_json[form] && data.salt_forms_json[form][strength]) {
            const hasSellingPrice = Object.values(data.salt_forms_json[form][strength]).some(packageData =>
                getMinSellingPrice(packageData) !== null
            );
            return hasSellingPrice ? '5px solid black' : '3px dashed black';
        }
        return '';
    };
    const getFormBorderStyle = (form) => {
        if (form && data.salt_forms_json[form]) {
            const hasSellingPrice = Object.values(data.salt_forms_json[form]).some(strengthData =>
                Object.values(strengthData).some(packageData =>
                    getMinSellingPrice(packageData) !== null
                )
            );
            return hasSellingPrice ? '5px solid black' : '3px dashed black';
        }
        return '';
    };

    const [ buttons, setButtons ] = useState(data.available_forms);
    const [ showButton, setShowButton ] = useState(false);
    const visibleButtons = showButton ? buttons : buttons.slice(0, 4);

    return (
        <section className="flex items-center justify-between gap-2 w-full shadow-2xl rounded-lg p-1 bg-gradient-to-r from-white via-slate-100 to-sky-100">
            <div className="w-[40%]">
                <div className="p-3 flex items-center justify-start gap-4">
                    <h1 className="w-28">Form:</h1>
                    <div className={`grid grid-cols-2 gap-5`}>
                        {
                            visibleButtons.map((form, index) => {
                                return <button key={index} onClick={() => handleStrengthData(form)} className={`p-2 ${showButton ? "overflow-hidden" : "overflow-visible" } rounded-lg text-md font-medium ${getFormBorderStyle ? "focus:bg-green-900" : ""}`} style={{
                                    border: getFormBorderStyle(form),
                                }}>{form}</button>
                            })
                        }
                    </div>
                    <div className="flex items-end" onClick={() => setShowButton(current => !current)}>
                    {
                        visibleButtons.length > 4 ? <h1 className="font-semibold cursor-pointer">{showButton ? "Hide" : "Show"}</h1> : ""
                    }
                </div>
                </div>
                <div className="p-3 flex items-center justify-start gap-4">
                    <h1 className="w-28">Strength:</h1>
                    <div className="grid grid-cols-2 gap-3">
                        {
                            selectedForm && data.salt_forms_json[selectedForm] && Object.keys(data.salt_forms_json[selectedForm]).map((strength, index) => {
                                return <button key={index} onClick={() => handlePackagingData(strength)} className="rounded-lg pl-2 pr-2 p-1 text-md font-medium border-black" style={{
                                    border: getStrengthBorderStyle(selectedForm, strength),
                                }}>{strength}</button>
                            })
                        }
                    </div> 
                </div>
                <div className="p-3 flex items-center justify-start gap-4">
                    <h1 className="w-28">Packaging:</h1>
                    <div className="grid grid-cols-2 gap-3">
                        {
                            selectedForm && selectedStrength && data.salt_forms_json[selectedForm] && data.salt_forms_json[selectedForm][selectedStrength] && Object.keys(data.salt_forms_json[selectedForm][selectedStrength]).map((packageName, index) => {
                                return <button key={index} onClick={() => showPackagingData(packageName)} className="border- rounded-lg pl-2 pr-2 p-1 text-md font-medium border-black" style={{
                                    boxShadow: "0 0 10px rgba(0, 50, 0, 0.5)",
                                    border: getBorderStyle(selectedForm, selectedStrength, packageName),
                                }}>{packageName}</button>
                            })
                        }
                    </div>
                    </div>
            </div>
            <div className="w-[32%] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-medium">{data.salt}</h1>
                <div className="flex items-center justify-center gap-2">
                    <p className="font-medium">{ selectedForm }</p> | <p className="font-medium">{ selectedStrength }</p> | <p className="font-medium"> { selectedPackage }</p>
                </div>
            </div>
            <div className="w-[20%] flex items-center justify-center p-1">
                {selectedPackage && (
                    <h1 className="text-center font-semibold w-[40%] border-2 p-2 border-slate-400 rounded-lg">
                        {minSellingPrice !== null ? `From Rs: ${minSellingPrice}`: "No stores selling this product near you"}
                    </h1>
                )}
            </div>
        </section>
    )
}

export default Card;