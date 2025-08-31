import React from 'react';
import { FileText, Eye, CheckCircle, BarChart3, Archive } from 'lucide-react';
import type { ItemStats } from '../utils/types';

interface StatsCardsProps {
  stats: ItemStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Items',
      value: stats.total,
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      bgColor: 'bg-purple-600',
    },
    {
      title: 'Unread',
      value: stats.unread,
      icon: BarChart3,
      color: 'bg-gray-50 text-gray-600',
      bgColor: 'bg-gray-600',
    },
    {
      title: 'Reading',
      value: stats.reading,
      icon: Eye,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-600',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-600',
    },
    {
      title: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'bg-yellow-50 text-yellow-600',
      bgColor: 'bg-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}