
export const ZapCell = ({
    name,
    index,
    onClick
}: {
    name?: string; 
    index: number;
    onClick: () => void;
}) => {
    return <div onClick={onClick} className="border border-gray-200  py-8 px-8 flex w-[300px] justify-center cursor-pointer bg-gray-300 mt-2 text-gray-900 font-bold rounded-md">
        <div className="flex text-xl">
            <div className="font-bold">
                {index}. 
            </div>
            <div>
                {name}
            </div>
        </div>
    </div>
}