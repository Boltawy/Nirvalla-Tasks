"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Search, Menu, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import type { ViewMode } from "../page";

export function TaskHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Nirvalla Tasks
          </h1>
        </div>

        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
}
