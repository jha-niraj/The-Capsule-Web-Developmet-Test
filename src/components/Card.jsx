import React, { useState, useEffect, useMemo } from "react";

const Card = ({ data }) => {
    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [minSellingPrice, setMinSellingPrice] = useState(null);
    const [showAllForms, setShowAllForms] = useState(false);

    const availableForms = useMemo(() => data.available_forms || [], [data.available_forms]);
    const visibleForms = showAllForms ? availableForms : availableForms.slice(0, 4);

    useEffect(() => {
        if (data.salt_forms_json) {
            const defaultForm = Object.keys(data.salt_forms_json)[0];
            setSelectedForm(defaultForm);
            
            if (defaultForm && data.salt_forms_json[defaultForm]) {
                const defaultStrength = Object.keys(data.salt_forms_json[defaultForm])[0];
                setSelectedStrength(defaultStrength);
                
                if (defaultStrength && data.salt_forms_json[defaultForm][defaultStrength]) {
                    const defaultPackage = Object.keys(data.salt_forms_json[defaultForm][defaultStrength])[0];
                    setSelectedPackage(defaultPackage);
                    
                    if (defaultPackage) {
                        setMinSellingPrice(getMinSellingPrice(data.salt_forms_json[defaultForm][defaultStrength][defaultPackage]));
                    }
                }
            }
        }
    }, [data.salt_forms_json]);

    const getMinSellingPrice = (packageData) => {
        if (!packageData) return null;
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

    const handleFormSelection = (form) => {
        setSelectedForm(form);
        if (data.salt_forms_json && data.salt_forms_json[form]) {
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
    };

    const handleStrengthSelection = (strength) => {
        setSelectedStrength(strength);
        if (data.salt_forms_json[selectedForm] && data.salt_forms_json[selectedForm][strength]) {
            const defaultPackage = Object.keys(data.salt_forms_json[selectedForm][strength])[0];
            setSelectedPackage(defaultPackage);
            setMinSellingPrice(getMinSellingPrice(data.salt_forms_json[selectedForm][strength][defaultPackage]));
        } else {
            setSelectedPackage(null);
            setMinSellingPrice(null);
        }
    };

    const handlePackageSelection = (packageName) => {
        setSelectedPackage(packageName);
        setMinSellingPrice(getMinSellingPrice(data.salt_forms_json[selectedForm][selectedStrength][packageName]));
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

    return (
        <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full shadow-2xl rounded-lg p-4 bg-gradient-to-r from-white via-slate-100 to-sky-100">
            <div className="w-full lg:w-[40%] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
                    <h1 className="w-28 font-semibold">Form:</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 w-full sm:w-auto">
                        {visibleForms.map((form, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleFormSelection(form)} 
                                className={`p-2 rounded-lg text-sm sm:text-md font-medium ${selectedForm === form ? 'bg-green-900 text-white' : ''}`}
                                style={{ border: getFormBorderStyle(form) }}
                                aria-label={`Select ${form} form`}
                            >
                                {form}
                            </button>
                        ))}
                    </div>
                    {availableForms.length > 4 && (
                        <button 
                            onClick={() => setShowAllForms(prev => !prev)}
                            className="text-sm font-semibold cursor-pointer mt-2 sm:mt-0"
                            aria-label={showAllForms ? "Hide additional forms" : "Show all forms"}
                        >
                            {showAllForms ? "Hide" : "Show"}
                        </button>
                    )}
                </div>
                {selectedForm && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
                        <h1 className="w-28 font-semibold">Strength:</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 w-full sm:w-auto">
                            {data.salt_forms_json[selectedForm] && Object.keys(data.salt_forms_json[selectedForm]).map((strength, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleStrengthSelection(strength)} 
                                    className={`rounded-lg px-2 py-1 text-sm sm:text-md font-medium ${selectedStrength === strength ? 'bg-green-900 text-white' : ''}`}
                                    style={{ border: getStrengthBorderStyle(selectedForm, strength) }}
                                    aria-label={`Select ${strength} strength`}
                                >
                                    {strength}
                                </button>
                            ))}
                        </div> 
                    </div>
                )}
                {selectedStrength && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
                        <h1 className="w-28 font-semibold">Packaging:</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 w-full sm:w-auto">
                            {data.salt_forms_json[selectedForm] && data.salt_forms_json[selectedForm][selectedStrength] && 
                             Object.keys(data.salt_forms_json[selectedForm][selectedStrength]).map((packageName, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handlePackageSelection(packageName)} 
                                    className={`rounded-lg px-2 py-1 text-sm sm:text-md font-medium ${selectedPackage === packageName ? 'bg-green-900 text-white' : ''}`}
                                    style={{
                                        boxShadow: "0 0 10px rgba(0, 50, 0, 0.5)",
                                        border: getBorderStyle(selectedForm, selectedStrength, packageName),
                                    }}
                                    aria-label={`Select ${packageName} package`}
                                >
                                    {packageName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full lg:w-[32%] flex flex-col items-center justify-center mt-4 lg:mt-0">
                <h1 className="text-xl sm:text-2xl font-medium text-center">{data.salt}</h1>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <p className="font-medium">{selectedForm}</p> 
                    <span className="hidden sm:inline">|</span> 
                    <p className="font-medium">{selectedStrength}</p> 
                    <span className="hidden sm:inline">|</span> 
                    <p className="font-medium">{selectedPackage}</p>
                </div>
            </div>
            <div className="w-full lg:w-[20%] flex items-center justify-center mt-4 lg:mt-0">
                {selectedPackage && (
                    <h1 className="text-center font-semibold w-full sm:w-[60%] lg:w-[80%] border-2 p-2 border-slate-400 rounded-lg">
                        {minSellingPrice !== null ? `From Rs: ${minSellingPrice}` : "No stores selling this product near you"}
                    </h1>
                )}
            </div>
        </section>
    );
};

export default Card;