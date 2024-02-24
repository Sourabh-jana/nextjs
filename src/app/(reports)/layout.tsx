import React from "react";
import { Sidebar } from "@/components/my/Sidebar";
import { Inbox, Send, ArchiveX, Trash2, Archive, File } from "lucide-react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {children}
    </div>
  );
};

export default layout;
