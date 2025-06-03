
import type {  StatCardProps } from '../config/conf';
const StatCard = ({ title, value, info, color }: StatCardProps) => {
    return (
  <div className="flex flex-col ">
    <div className="flex items-center space-x-2 mb-2">
      <span className="text-sm font-bold  text-gray-600">{title}</span>
      <div className={`w-4 h-4  rounded-full flex items-center justify-center ${color}`}>
        <span className="text-xs text-white font-medium">{info}</span>
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
   );
}

export default StatCard