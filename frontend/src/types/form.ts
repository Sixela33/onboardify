export enum FormItemType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    FILE = 'file',
}

export interface FormItem {
    name: string;
    question: string;
    type: FormItemType;
    step: number;
}

export interface Form {
    name: string;
    items: FormItem[];
} 