"use client"

import { useState } from "react"
import { AlertTriangle, Archive, Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DangerZoneModalsProps {
  projectName: string
  onArchive: () => void
  onTransfer: (newOwnerId: string) => void
  onDelete: () => void
}

export function DangerZoneModals({ projectName, onArchive, onTransfer, onDelete }: DangerZoneModalsProps) {
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  // Mock users for transfer ownership
  const mockUsers = [
    { id: "u1", name: "Sarah Johnson", initials: "SJ", color: "bg-blue-500" },
    { id: "u2", name: "Michael Chen", initials: "MC", color: "bg-green-500" },
    { id: "u3", name: "Alex Rodriguez", initials: "AR", color: "bg-purple-500" },
  ]

  const handleArchive = () => {
    onArchive()
    setArchiveOpen(false)
  }

  const handleTransfer = () => {
    if (selectedUser) {
      onTransfer(selectedUser)
      setTransferOpen(false)
      setSelectedUser(null)
    }
  }

  const handleDelete = () => {
    onDelete()
    setDeleteOpen(false)
    setConfirmText("")
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border p-4">
        <h3 className="text-lg font-medium">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These actions can't be undone. Please proceed with caution.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <h4 className="font-medium">Archive this project</h4>
              <p className="text-sm text-muted-foreground">The project will be hidden but can be restored later.</p>
            </div>
            <Button variant="outline" onClick={() => setArchiveOpen(true)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <h4 className="font-medium">Transfer ownership</h4>
              <p className="text-sm text-muted-foreground">Transfer this project to another team member.</p>
            </div>
            <Button variant="outline" onClick={() => setTransferOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Transfer
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <h4 className="font-medium text-destructive">Delete this project</h4>
              <p className="text-sm text-muted-foreground">Permanently delete this project and all its data.</p>
            </div>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive project</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive <span className="font-medium">{projectName}</span>? The project will be
              hidden from your dashboard but can be restored later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              Archive project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Ownership Modal */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
            <DialogDescription>
              Select a team member to transfer ownership of <span className="font-medium">{projectName}</span>. You will
              become a regular team member after the transfer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select new owner</Label>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer ${
                      selectedUser === user.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`text-white ${user.color}`}>{user.initials}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleTransfer} disabled={!selectedUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Transfer ownership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Delete project
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-medium"> {projectName} </span>
              project and all associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm">
                To confirm, type <span className="font-medium">delete {projectName}</span>
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`delete ${projectName}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={confirmText !== `delete ${projectName}`}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
