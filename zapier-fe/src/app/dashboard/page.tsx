"use client"
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { LinkButton } from "@/components/buttons/LinkButton";
import { BACKEND_URL, HOOKS_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zap`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(res => {
                setZaps(res.data.zaps);
                setLoading(false)
            })
    }, []);

    return {
        loading, zaps
    }
}

export default function () {
    const { loading, zaps } = useZaps();
    const router = useRouter();

    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	 w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zap/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZapTable zaps={zaps} /> </div>}
    </div>
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
    const router = useRouter();

    return (
        <div className="p-8 max-w-screen-lg w-full">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Name
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                ID
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Created At
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Webhook URL
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Go
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {zaps.map((z) => (
                            <tr
                                key={z.id}
                                className="border-b hover:bg-gray-900 transition"
                            >
                                {z.trigger?.type?.image ?
                                    <td className="flex items-center gap-2">
                                        {z.trigger?.type?.image && (
                                            <img
                                                src={z.trigger.type.image}
                                                alt="trigger"
                                                className="w-[30px] h-[30px]"
                                            />
                                        )}

                                        {z.actions.map((x) =>
                                            x.type?.image ? (
                                                <img
                                                    key={x.id}
                                                    src={x.type.image}
                                                    alt="action"
                                                    className="w-[30px] h-[30px]"
                                                />
                                            ) : null
                                        )}
                                    </td>
                                    :

                                    (<td className="px-4 py-3">
                                        Zap
                                    </td>)}

                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {z.id}
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-500">
                                    Nov 13, 2023
                                </td>

                                <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-[250px]">
                                    {`${HOOKS_URL}/hooks/catch/1/${z.id}`}
                                </td>

                                <td className="px-4 py-3">
                                    <LinkButton
                                        onClick={() => router.push("/zap/" + z.id)}
                                    >
                                        Go
                                    </LinkButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
