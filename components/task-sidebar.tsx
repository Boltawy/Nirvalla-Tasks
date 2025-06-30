"use client"

import type React from "react"

import { useState } from "react"
import { Plus, List, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TaskList } from "../types/types"
import { cn } from "@/lib/utils"

interface TaskSidebarProps {
  taskLists: TaskList[]
  selectedListId: string
  onSelectList: (listId: string) => void
  onAddList: (name: string) => void
}

export function TaskSidebar({ taskLists, selectedListId, onSelectList, onAddList }: TaskSidebarProps) {
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    <div
      className={cn(
        "bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-80",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          {!isCollapsed && <h1 className="text-xl font-medium text-gray-900">Tasks</h1>}
        </div>
      </div>

      {/* Task Lists */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {taskLists.map((list) => (
            <button
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors",
                selectedListId === list.id && "bg-blue-50 text-blue-700 hover:bg-blue-50",
              )}
            >
              <List className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{list.name}</div>
                  <div className="text-sm text-gray-500">
                    {list.tasks.filter((task) => !task.completed).length} tasks
                  </div>
                </div>
              )}
            </button>
          ))}

          {/* Add New List */}
          {!isCollapsed && (
            <div className="mt-2">
              {isAddingList ? (
                <div className="px-3 py-2">
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={() => {
                      if (!newListName.trim()) {
                        setIsAddingList(false)
                      }
                    }}
                    placeholder="Enter list name"
                    className="h-8"
                    autoFocus
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingList(true)}
                  className="w-full justify-start gap-3 px-3 py-2 h-auto text-gray-600 hover:text-gray-900"
                >
                  <Plus className="h-4 w-4" />
                  Create new list
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
