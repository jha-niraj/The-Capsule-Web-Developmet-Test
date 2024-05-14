const InputBox = ({ name, type, id, placeholder }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <input name={name} type={type} id={id} placeholder={placeholder}  />
        </div>
    )
}

export default InputBox;