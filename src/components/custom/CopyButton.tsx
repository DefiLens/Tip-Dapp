import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
// import toast from "react-hot-toast";

interface CopyButtonProps {
    copy: string | undefined;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copy }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // toast.success("Copied to clipboard");
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Hide tick icon after 3 seconds
    };

    return (
        <div onClick={() => copyToClipboard(copy ?? "")} className="hover:bg-B900 p-1.5 rounded-md cursor-pointer text-xs">
            {copied ? (
                <FiCheck className="text-B10" />
            ) : (
                <FiCopy className="text-B10" />
            )}
        </div>
    );
};

export default CopyButton;
