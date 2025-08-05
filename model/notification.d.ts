export interface INotification {
    id?: number;
    title?: string;
    description?: string;
    isRead?: boolean;
    createdAt?: string; // Optional field for the creation date
}