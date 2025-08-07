"use client";

import React from "react";
import { TrendingUp, Clock, Star } from "lucide-react";

export type FilterType = "hot" | "new" | "best";

interface PostFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  postCount: number;
}

const PostFilters: React.FC<PostFiltersProps> = ({
  activeFilter,
  onFilterChange,
  postCount,
}) => {
  const filters = [
    {
      id: "hot" as FilterType,
      label: "Hot",
      icon: TrendingUp,
      description: "Most popular posts",
    },
    {
      id: "new" as FilterType,
      label: "New",
      icon: Clock,
      description: "Latest posts",
    },
    {
      id: "best" as FilterType,
      label: "Best",
      icon: Star,
      description: "Highest engagement",
    },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Feed
          </h3>
          <p className="mt-1 text-gray-400">
            {postCount} post{postCount !== 1 ? 's' : ''} • Stay updated with campus politics
          </p>
        </div>
        
        {/* Filter Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} />
            <span>Sort by</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }
              `}
              title={filter.description}
            >
              <IconComponent 
                size={16} 
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              />
              <span>{filter.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Description */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {(() => {
            const activeFilterData = filters.find(f => f.id === activeFilter);
            const IconComponent = activeFilterData?.icon;
            return (
              <>
                {IconComponent && <IconComponent size={14} />}
                <span>
                  Showing {activeFilterData?.description.toLowerCase()} 
                  {postCount > 0 && ` • ${postCount} post${postCount !== 1 ? 's' : ''} found`}
                </span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default PostFilters; 