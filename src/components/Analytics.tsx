import { BarChart3, Clock, BookOpen, Target, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  stats?: {
    totalItems: number;
    unreadItems: number;
    readingItems: number;
    completedItems: number;
    archivedItems: number;
    totalReadingTime: number;
    averageReadingTime: number;
  };
}

export function Analytics({ stats }: AnalyticsProps) {
  const defaultStats = {
    totalItems: 0,
    unreadItems: 0,
    readingItems: 0,
    completedItems: 0,
    archivedItems: 0,
    totalReadingTime: 0,
    averageReadingTime: 0,
  };

  const data = stats || defaultStats;
  
  const completionRate = data.totalItems > 0 ? Math.round((data.completedItems / data.totalItems) * 100) : 0;
  const readingProgress = data.totalItems > 0 ? Math.round(((data.readingItems + data.completedItems) / data.totalItems) * 100) : 0;

  const statusDistribution = [
    { label: 'Unread', value: data.unreadItems, color: 'bg-gray-500', percentage: data.totalItems > 0 ? Math.round((data.unreadItems / data.totalItems) * 100) : 0 },
    { label: 'Reading', value: data.readingItems, color: 'bg-blue-500', percentage: data.totalItems > 0 ? Math.round((data.readingItems / data.totalItems) * 100) : 0 },
    { label: 'Completed', value: data.completedItems, color: 'bg-green-500', percentage: data.totalItems > 0 ? Math.round((data.completedItems / data.totalItems) * 100) : 0 },
    { label: 'Archived', value: data.archivedItems, color: 'bg-yellow-500', percentage: data.totalItems > 0 ? Math.round((data.archivedItems / data.totalItems) * 100) : 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your reading progress and habits</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Target size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reading Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(data.totalReadingTime / 60)}h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reading Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{readingProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Reading Status Distribution</h2>
        
        <div className="space-y-4">
          {statusDistribution.map((status) => (
            <div key={status.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${status.color}`}
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{status.value}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">{status.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Habits</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average reading time</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.averageReadingTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Items added this week</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Items completed this week</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">-</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goals & Targets</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly reading goal</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">5 / 10 items</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly completion rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
