"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Database,
  Plus,
  Trash2,
  AlertCircle,
  FileUp,
  Info,
} from "lucide-react"

interface FileUploadWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (projectData: any) => void
}

type FileWithPreview = File & {
  preview?: string
}

type ColumnSchema = {
  name: string
  dataType: string
  numericSign?: string
  precision?: string
  uniqueness?: string
  dateFormat?: string
  dateSeparator?: string
  description?: string
}

export function FileUploadWizard({ isOpen, onClose, onComplete }: FileUploadWizardProps) {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [dataDescription, setDataDescription] = useState("")
  const [columns, setColumns] = useState<ColumnSchema[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState("")
  const [expandedColumns, setExpandedColumns] = useState<number[]>([])

  // Refs for click outside detection
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      )

      // Try to extract a project name from the first file
      if (acceptedFiles.length > 0 && !projectName) {
        const fileName = acceptedFiles[0].name
        const nameWithoutExtension = fileName.split(".").slice(0, -1).join(".")
        setProjectName(nameWithoutExtension)
      }

      // Simulate column detection from CSV/Excel
      if (acceptedFiles.length > 0) {
        // This would normally be done by parsing the file
        // For demo purposes, we'll create some sample columns
        setColumns([
          { name: "id", dataType: "Integer", numericSign: "Positive Only", uniqueness: "Unique" },
          { name: "timestamp", dataType: "Date", dateFormat: "MM/DD/YYYY", dateSeparator: "/" },
          { name: "value", dataType: "Float", precision: "2 Decimals" },
          { name: "category", dataType: "String" },
          { name: "status", dataType: "String" },
        ])
      }
    },
    [projectName],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
  })

  const toggleColumnExpanded = (index: number) => {
    setExpandedColumns((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const addColumn = () => {
    const newColumnIndex = columns.length
    setColumns([...columns, { name: `column_${newColumnIndex + 1}`, dataType: "String" }])
    setExpandedColumns([...expandedColumns, newColumnIndex])
  }

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
    setExpandedColumns(expandedColumns.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)))
  }

  const updateColumn = (index: number, field: keyof ColumnSchema, value: string) => {
    const updatedColumns = [...columns]
    updatedColumns[index] = { ...updatedColumns[index], [field]: value }
    setColumns(updatedColumns)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const projectData = {
      name: projectName,
      description: projectDescription,
      dataDescription,
      files,
      columns,
      category,
    }

    onComplete(projectData)
    setIsSubmitting(false)
    onClose()

    // Reset form
    setStep(1)
    setFiles([])
    setProjectName("")
    setProjectDescription("")
    setDataDescription("")
    setColumns([])
    setCategory("")
    setExpandedColumns([])
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-md bg-[#121212] border border-[#2a2a2a] shadow-xl"
      >
        {/* Header */}
        <div className="border-b border-[#2a2a2a] p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">New Project</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-3 flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center space-y-1.5 relative">
                <div
                  className={`w-16 h-0.5 absolute top-1 ${stepNumber === 1 ? "hidden" : step >= stepNumber ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"}`}
                  style={{ right: "50%", marginRight: "10px" }}
                ></div>
                <div
                  className={`w-16 h-0.5 absolute top-1 ${stepNumber === 3 ? "hidden" : step > stepNumber ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"}`}
                  style={{ left: "50%", marginLeft: "10px" }}
                ></div>
                <div
                  className={`w-5 h-5 flex items-center justify-center ${
                    step === stepNumber
                      ? "border-2 border-[#2a2a2a] bg-[#1a1a1a]"
                      : step > stepNumber
                        ? "bg-[#2a2a2a] text-[#121212]"
                        : "bg-[#1a1a1a] text-gray-500"
                  }`}
                >
                  {step > stepNumber ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span className="text-xs">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    step === stepNumber ? "font-medium" : step > stepNumber ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stepNumber === 1 ? "Upload" : stepNumber === 2 ? "Details" : "Schema"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${
                      isDragActive
                        ? "border-[#3a3a3a] bg-[#2a2a2a]/10"
                        : "border-[#2a2a2a] hover:border-gray-500 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {isDragActive ? (
                        <FileUp className="h-8 w-8 text-gray-300" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                      <div className="space-y-1">
                        <p className="text-xs font-medium">
                          {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
                        </p>
                        <p className="text-xs text-gray-500">Supports CSV, XLS, XLSX</p>
                      </div>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
                      {files.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between p-2 border-b border-[#2a2a2a] last:border-0"
                        >
                          <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-4 w-4 text-gray-300" />
                            <div>
                              <p className="text-xs font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setFiles([])}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium">Project Name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                      >
                        <option value="">Select a category</option>
                        <option value="Analytics">Analytics</option>
                        <option value="Research">Research</option>
                        <option value="Financial">Financial</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Project Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-medium">About Your Data</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Providing details about your data helps us improve error detection and cleaning processes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Data Description</label>
                    <textarea
                      value={dataDescription}
                      onChange={(e) => setDataDescription(e.target.value)}
                      placeholder="Describe your data's purpose, structure, and any other relevant details..."
                      rows={4}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors resize-none"
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium">File Preview</h4>
                      <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
                        <div className="p-2 border-b border-[#2a2a2a] bg-[#1a1a1a]">
                          <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-4 w-4 text-gray-300" />
                            <p className="text-xs font-medium">{files[0].name}</p>
                          </div>
                        </div>
                        <div className="p-2 overflow-x-auto">
                          <table className="min-w-full divide-y divide-[#2a2a2a]">
                            <thead>
                              <tr>
                                {columns.map((column) => (
                                  <th
                                    key={column.name}
                                    className="px-2 py-1.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                  >
                                    {column.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2a2a]">
                              {/* Sample data rows - would be generated from actual file */}
                              {[1, 2, 3].map((row) => (
                                <tr key={row}>
                                  {columns.map((column) => (
                                    <td key={`${row}-${column.name}`} className="px-2 py-1.5 text-xs text-gray-300">
                                      {column.dataType === "Integer"
                                        ? Math.floor(Math.random() * 100)
                                        : column.dataType === "Float"
                                          ? (Math.random() * 100).toFixed(2)
                                          : column.dataType === "Date"
                                            ? "2023-04-15"
                                            : `Sample ${column.name} ${row}`}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium">Schema Definition</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Define the schema for your data columns</p>
                  </div>
                  <button
                    onClick={addColumn}
                    className="flex items-center space-x-1 rounded-md bg-[#2a2a2a] px-2 py-1 text-xs font-medium hover:bg-[#3a3a3a] transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {columns.length === 0 ? (
                    <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 p-4 text-center">
                      <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-xs font-medium mb-1">No Columns Detected</h4>
                      <p className="text-xs text-gray-400 mb-3">
                        Upload a file in step 1 or manually add columns using the "Add Column" button.
                      </p>
                      <button
                        onClick={addColumn}
                        className="inline-flex items-center space-x-1 rounded-md bg-[#2a2a2a] px-2 py-1 text-xs font-medium hover:bg-[#3a3a3a] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Column</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {columns.map((column, index) => (
                        <div key={index} className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 overflow-hidden">
                          <div
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-[#1e1e1e] transition-colors"
                            onClick={() => toggleColumnExpanded(index)}
                          >
                            <div className="flex items-center space-x-2">
                              <Database className="h-3.5 w-3.5 text-gray-300" />
                              <span className="text-xs font-medium">{column.name}</span>
                              <span className="text-xs text-gray-500">{column.dataType}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeColumn(index)
                                }}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <ChevronDown
                                className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                                  expandedColumns.includes(index) ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {expandedColumns.includes(index) && (
                            <div className="p-2 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium">Column Name</label>
                                  <input
                                    type="text"
                                    value={column.name}
                                    onChange={(e) => updateColumn(index, "name", e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-medium">Data Type</label>
                                  <select
                                    value={column.dataType}
                                    onChange={(e) => updateColumn(index, "dataType", e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                  >
                                    <option value="String">String</option>
                                    <option value="Integer">Integer</option>
                                    <option value="Float">Float</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Date">Date</option>
                                    <option value="DateTime">DateTime</option>
                                  </select>
                                </div>

                                {(column.dataType === "Integer" || column.dataType === "Float") && (
                                  <>
                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Numeric Sign</label>
                                      <select
                                        value={column.numericSign || "Any"}
                                        onChange={(e) => updateColumn(index, "numericSign", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="Any">Any</option>
                                        <option value="Positive Only">Positive Only</option>
                                        <option value="Negative Only">Negative Only</option>
                                        <option value="Non-Zero">Non-Zero</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Precision</label>
                                      <select
                                        value={column.precision || "No Limit"}
                                        onChange={(e) => updateColumn(index, "precision", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="No Limit">No Limit</option>
                                        <option value="0 Decimals">0 Decimals</option>
                                        <option value="1 Decimal">1 Decimal</option>
                                        <option value="2 Decimals">2 Decimals</option>
                                        <option value="3 Decimals">3 Decimals</option>
                                        <option value="4 Decimals">4 Decimals</option>
                                      </select>
                                    </div>
                                  </>
                                )}

                                {(column.dataType === "Date" || column.dataType === "DateTime") && (
                                  <>
                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Date Format</label>
                                      <select
                                        value={column.dateFormat || "MM/DD/YYYY"}
                                        onChange={(e) => updateColumn(index, "dateFormat", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                        <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Date Separator</label>
                                      <select
                                        value={column.dateSeparator || "/"}
                                        onChange={(e) => updateColumn(index, "dateSeparator", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="/">/</option>
                                        <option value="-">-</option>
                                        <option value=".">.</option>
                                      </select>
                                    </div>
                                  </>
                                )}

                                <div className="space-y-2">
                                  <label className="block text-xs font-medium">Uniqueness</label>
                                  <select
                                    value={column.uniqueness || "Non-Unique"}
                                    onChange={(e) => updateColumn(index, "uniqueness", e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                  >
                                    <option value="Non-Unique">Non-Unique (Duplicates permitted)</option>
                                    <option value="Unique">Unique (No duplicates allowed)</option>
                                  </select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                  <label className="block text-xs font-medium">Description</label>
                                  <textarea
                                    value={column.description || ""}
                                    onChange={(e) => updateColumn(index, "description", e.target.value)}
                                    placeholder="Describe this column's purpose and content..."
                                    rows={2}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-[#2a2a2a] p-3 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-md bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-2">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-1 rounded-md bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium hover:bg-[#2a2a2a] transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={step === 1 && files.length === 0}
                className={`flex items-center space-x-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  step === 1 && files.length === 0
                    ? "bg-[#2a2a2a]/50 cursor-not-allowed"
                    : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-1 rounded-md bg-[#2a2a2a] px-3 py-1.5 text-xs font-medium hover:bg-[#3a3a3a] transition-colors disabled:bg-[#2a2a2a]/50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
