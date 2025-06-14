import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { FormItemType } from '@/types/form'
import axiosInstance from '@/lib/axiosInstance'

interface FormItem {
  name: string;
  question: string;
  type: FormItemType;
  step: number;
}

export default function CreateForm() {
  const [formName, setFormName] = useState('')
  const [formItems, setFormItems] = useState<FormItem[]>([])

  const addFormItem = () => {
    setFormItems([
      ...formItems,
      {
        name: '',
        question: '',
        type: FormItemType.TEXT,
        step: formItems.length + 1
      }
    ])
  }

  const removeFormItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index))
  }

  const updateFormItem = (index: number, field: keyof FormItem, value: string | FormItemType) => {
    const newItems = [...formItems]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    setFormItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    const response = await axiosInstance.post('/user-forms', { name: formName, items: formItems })
    console.log(response)
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Form Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name"
                required
              />
            </div>

            <div className="space-y-4">
              {formItems.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFormItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Field Name</label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateFormItem(index, 'name', e.target.value)}
                        placeholder="Enter field name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question</label>
                      <Input
                        value={item.question}
                        onChange={(e) => updateFormItem(index, 'question', e.target.value)}
                        placeholder="Enter question"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select
                        value={item.type}
                        onValueChange={(value) => updateFormItem(index, 'type', value as FormItemType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={FormItemType.TEXT}>Text</SelectItem>
                          <SelectItem value={FormItemType.NUMBER}>Number</SelectItem>
                          <SelectItem value={FormItemType.DATE}>Date</SelectItem>
                          <SelectItem value={FormItemType.BOOLEAN}>Boolean</SelectItem>
                          <SelectItem value={FormItemType.FILE}>File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addFormItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Create Form
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
