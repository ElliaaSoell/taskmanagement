"use client"

import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import type { Task } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<"all" | "to-do" | "in-progress" | "done">("all")
  const { toast } = useToast()

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        setTasks(parsedTasks)
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error)
      toast({
        title: "Error",
        description: "Failed to load saved tasks.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error)
      toast({
        title: "Error",
        description: "Failed to save tasks.",
        variant: "destructive",
      })
    }
  }, [tasks, toast])

  // Sort tasks by priority (high -> medium -> low) and then by creation date
  const sortTasksByPriority = (tasks: Task[]): Task[] => {
    const priorityOrder: Record<"low" | "medium" | "high", number> = {
      high: 3,
      medium: 2,
      low: 1,
    }

    return [...tasks].sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }

    setTasks((prevTasks) => [...prevTasks, newTask])
    setIsFormOpen(false)
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    })
  }

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setIsFormOpen(false)
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    toast({
      title: "Task deleted",
      description: "Your task has been deleted.",
    })
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  // Sort filtered tasks by priority
  const sortedTasks = sortTasksByPriority(filteredTasks)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Task Manager</h1>
            <p className="text-gray-600">
              Manage your tasks efficiently. Tasks are automatically sorted by priority (High → Medium → Low).
            </p>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-900">{tasks.filter((t) => t.status === "to-do").length}</div>
              <div className="text-sm text-gray-600">To Do</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "in-progress").length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{tasks.filter((t) => t.status === "done").length}</div>
              <div className="text-sm text-gray-600">Done</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.priority === "high" && t.status !== "done").length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                All ({tasks.length})
              </Button>
              <Button variant={filter === "to-do" ? "default" : "outline"} onClick={() => setFilter("to-do")}>
                To Do ({tasks.filter((t) => t.status === "to-do").length})
              </Button>
              <Button
                variant={filter === "in-progress" ? "default" : "outline"}
                onClick={() => setFilter("in-progress")}
              >
                In Progress ({tasks.filter((t) => t.status === "in-progress").length})
              </Button>
              <Button variant={filter === "done" ? "default" : "outline"} onClick={() => setFilter("done")}>
                Done ({tasks.filter((t) => t.status === "done").length})
              </Button>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Task List */}
          <TaskList tasks={sortedTasks} onDelete={deleteTask} onEdit={handleEditTask} />

          {/* Task Form */}
          <TaskForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={editingTask ? updateTask : addTask}
            editingTask={editingTask}
          />
        </div>
      </div>
    </div>
  )
}
