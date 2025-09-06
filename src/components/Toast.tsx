import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<Toast, 'id'>) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            hideToast(id);
        }, toast.duration || 3000);
    };

    const hideToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onHide={hideToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[]; onHide: (id: string) => void }> = ({ toasts, onHide }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onHide={onHide} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: Toast; onHide: (id: string) => void }> = ({ toast, onHide }) => {
    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-600" />;
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getBgColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${getBgColor()} animate-in slide-in-from-right-full`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{toast.title}</h4>
                    {toast.message && (
                        <p className="mt-1 text-sm text-gray-600">{toast.message}</p>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => onHide(toast.id)}
                        className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
