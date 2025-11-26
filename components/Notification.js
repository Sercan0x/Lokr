import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Notification({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-lg animate-slide-in ${
      notification.type === 'success' ? 'bg-green-500/20 border border-green-500/50' :
      notification.type === 'error' ? 'bg-red-500/20 border border-red-500/50' :
      'bg-blue-500/20 border border-blue-500/50'
    }`}>
      <div className="flex items-center space-x-3">
        {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
         notification.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
         <AlertCircle className="w-5 h-5 text-blue-400" />}
        <span className="text-white font-medium">{notification.message}</span>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
