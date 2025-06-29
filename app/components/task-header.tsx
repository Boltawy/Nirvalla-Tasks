"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, Menu, List, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ViewMode } from "../page"

interface TaskHeaderProps {
  onAddList: (name: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function TaskHeader({ onAddList, viewMode, onViewModeChange }: TaskHeaderProps) {
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListName, setNewListName] = useState("")

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim())
      setNewListName("")
      setIsAddingList(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddList()
    } else if (e.key === "Escape") {
      setIsAddingList(false)
      setNewListName("")
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium text-gray-900">Tasks</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search tasks" className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {isAddingList ? (
            <div className="flex items-center gap-2">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  if (!newListName.trim()) {
                    setIsAddingList(false)
                  }
                }}
                placeholder="List name"
                className="w-32"
                autoFocus
              />
              <Button size="sm" onClick={handleAddList}>
                Add
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsAddingList(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create list
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
