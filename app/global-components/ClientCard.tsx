import { Banknote, Mail, MailCheck, Phone, Users } from "lucide-react";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ClientCard({ client }: { client: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: client._id,
    data: {
      type: "client",
      client,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const clientTierEnum = {
    Gold: "yellow-300",
    Silver: "gray-400",
    Bronze: "yellow-600",
  };
  return (
    <>
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className={
          "w-[400px] rounded-md p-6 shadow-md bg-white flex flex-col border border-gray-200 border-b-4 border-b-" +
          clientTierEnum[client.tier]
        }
      >
        <h4 className="w-full mb-4 pb-2 text-xl font-medium self-start border-b border-gray-200">
          {client.name}
        </h4>
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="flex items-center gap-2">
            <div
              className={
                "rounded-full w-4 h-4 bg-" + clientTierEnum[client.tier]
              }
            ></div>
            <p className="block text-sm text-gray-700">{client.tier}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin width={16} height={16} className="text-gray-400" />
            <p className="block text-sm text-gray-700">{client.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone width={16} height={16} className="text-gray-400" />
            <p className="block text-sm text-gray-700">{client.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail width={16} height={16} className="text-gray-400" />
            <p className="block text-sm text-gray-700 truncate">
              {client.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users width={16} height={16} className="text-gray-400" />
            <p className="block text-sm text-gray-700">{client.children}</p>
          </div>
          <div className="flex items-center gap-2">
            <Banknote width={16} height={16} className="text-gray-400" />
            <p className="block text-sm text-gray-700">{client.profit}</p>
          </div>
        </div>
        <Button variant="link" size="sm" className="underline self-end">
          View Client
        </Button>
      </div>
    </>
  );
}
