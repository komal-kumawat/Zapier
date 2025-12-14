import { ReactNode } from "react"

export const SecondaryButton = ({ children, onClick, size = "small" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 pt-2" : "px-10 py-4"} cursor-pointer hover:shadow-md hover:bg-gray-900 border text-gray-100 border-gray-100 rounded-full`}>
        {children}
    </div>
}