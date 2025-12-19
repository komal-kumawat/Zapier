"use client";

import { Appbar } from "@/components/Appbar";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/ZapCell";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState([]);
    const [availableTriggers, setAvailableTriggers] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(x => setAvailableActions(x.data.availableActions))
    }, [])

    return {
        availableActions,
        availableTriggers
    }
}

export default function() {
    const router = useRouter();
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string;
        name: string;
    }>();

    const [selectedActions, setSelectedActions] = useState<{
        index: number;
        availableActionId: string;
        availableActionName: string;
        metadata: any;
    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

    return <div>
        <Appbar />
        <div className="flex justify-end  p-4">
            <PrimaryButton onClick={async () => {
                if (!selectedTrigger?.id) {
                    return;
                }

                const response = await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                    "availableTriggerId": selectedTrigger.id,
                    "triggerMetadata": {},
                    "actions": selectedActions.map(a => ({
                        availableActionId: a.availableActionId,
                        actionMetadata: a.metadata
                    }))
                }, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                
                router.push("/dashboard");

            }}>Publish</PrimaryButton>
        </div>
        <div className="w-full min-h-screen  flex flex-col justify-center">
            <div className="flex justify-center w-full">
                <ZapCell onClick={() => {
                    setSelectedModalIndex(1);
                }} name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"} index={1} />
            </div>
            <div className="w-full pt-2 pb-2">
                {selectedActions.map((action, index) => <div className="pt-2 flex justify-center"> <ZapCell onClick={() => {
                    setSelectedModalIndex(action.index);
                }} name={action.availableActionName ? action.availableActionName : "Action"} index={action.index} /> </div>)}
            </div>
            <div className="flex justify-center">
                <div>
                    <PrimaryButton onClick={() => {
                        setSelectedActions(a => [...a, {
                            index: a.length + 2,
                            availableActionId: "",
                            availableActionName: "",
                            metadata: {}
                        }])
                    }}><div className="text-2xl">
                        +
                    </div></PrimaryButton>
                </div>
            </div>
        </div>
        {selectedModalIndex && <Modal availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions} onSelect={(props: null | { name: string; id: string; metadata: any; }) => {
            if (props === null) {
                setSelectedModalIndex(null);
                return;
            }
            if (selectedModalIndex === 1) {
                setSelectedTrigger({
                    id: props.id,
                    name: props.name
                })
            } else {
                setSelectedActions(a => {
                    let newActions = [...a];
                    newActions[selectedModalIndex - 2] = {
                        index: selectedModalIndex,
                        availableActionId: props.id,
                        availableActionName: props.name,
                        metadata: props.metadata
                    }
                    return newActions
                })
            }
            setSelectedModalIndex(null);
        }} index={selectedModalIndex} />}
    </div>
}

function Modal({
  index,
  onSelect,
  availableItems
}: {
  index: number,
  onSelect: (props: null | { id: string; name: string; metadata: any }) => void,
  availableItems: { id: string; name: string; image: string }[]
}) {
  const [selectedAction, setSelectedAction] = useState<{ id: string; name: string } | null>(null);
  const isTrigger = index === 1;

  const handleSelectAction = (item: { id: string; name: string }) => {
    setSelectedAction(item);
  };

  const handleSubmitMetadata = (metadata: any) => {
    if (!selectedAction) return;
    onSelect({ ...selectedAction, metadata });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-opacity-70 text-gray-900">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b rounded-t">
            <div className="text-xl">Select {isTrigger ? "Trigger" : "Action"}</div>
            <button
              onClick={() => onSelect(null)}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center"
            >
              <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {!selectedAction && (
              <div>
                {availableItems.map(item => (
                  <div
                    key={item.id}
                    className="flex border p-4 cursor-pointer hover:bg-slate-100"
                    onClick={() => {
                      if (isTrigger) {
                        onSelect({ id: item.id, name: item.name, metadata: {} });
                      } else {
                        // onSelect({ id: item.id, name: item.name , metadata:{} });
                        handleSelectAction({ id: item.id, name: item.name });
                      }
                    }}
                  >
                    <img src={item.image} width={30} className="rounded-full" />
                    <div className="flex flex-col justify-center ml-2">{item.name}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedAction && selectedAction.id === "email" && (
              <EmailSelector setMetadata={handleSubmitMetadata} />
            )}

            {selectedAction && selectedAction.id === "send_slack" && (
              <SolanaSelector setMetadata={handleSubmitMetadata} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function EmailSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");

    return <div className="bg-white h-100px">
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setEmail(e.target.value)}></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(e) => setBody(e.target.value)}></Input>
        <div className="pt-2">
            <PrimaryButton onClick={() => {
                setMetadata({
                    email,
                    body
                })
            }}>Submit</PrimaryButton>
        </div>
    </div>
}

function SolanaSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");    

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setAddress(e.target.value)}></Input>
        <Input label={"Amount"} type={"text"} placeholder="To" onChange={(e) => setAmount(e.target.value)}></Input>
        <div className="pt-4">
        <PrimaryButton onClick={() => {
            setMetadata({
                amount,
                address
            })
        }}>Submit</PrimaryButton>
        </div>
    </div>
}