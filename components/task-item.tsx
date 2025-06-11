"use client"

import { Calendar, Edit, Trash2 } from "lucide-react"

import type { Task } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskItem({ task, onDelete, onEdit }: TaskItemProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
    high: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  }

  const statusColors = {
    "to-do": "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
    "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    done: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  }

  const statusLabels = {
    "to-do": "To Do",
    "in-progress": "In Progress",
    done: "Done",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`transition-all hover:shadow-md ${task.status === "done" ? "opacity-75" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3
                className={`text-lg font-semibold leading-tight ${
                  task.status === "done" ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              <div className="flex gap-2">
                <Badge className={priorityColors[task.priority]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
                <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
              </div>
            </div>

            {task.description && (
              <p
                className={`text-sm leading-relaxed mb-3 ${task.status === "done" ? "text-gray-500" : "text-gray-700"}`}
              >
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>Created {formatDate(task.createdAt)}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Due {formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
          <Edit className="mr-1 h-3 w-3" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task "{task.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(task.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
