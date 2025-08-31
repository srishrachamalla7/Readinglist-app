import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ItemCard } from './ItemCard';
import { Item, ViewMode, ItemStatus } from '../utils/types';

interface VirtualizedItemListProps {
  items: Item[];
  viewMode: ViewMode;
  onStatusChange: (id: string, status: ItemStatus) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

const getItemHeight = (viewMode: ViewMode): number => {
  switch (viewMode) {
    case 'compact':
      return 60;
    case 'list':
      return 120;
    case 'grid':
    default:
      return 280;
  }
};

const getItemsPerRow = (viewMode: ViewMode, containerWidth: number): number => {
  if (viewMode === 'grid') {
    const minCardWidth = 320;
    const gap = 16;
    return Math.max(1, Math.floor((containerWidth + gap) / (minCardWidth + gap)));
  }
  return 1;
};

interface ItemRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: Item[];
    viewMode: ViewMode;
    itemsPerRow: number;
    onStatusChange: (id: string, status: ItemStatus) => void;
    onEdit: (item: Item) => void;
    onDelete: (id: string) => void;
  };
}

const ItemRow: React.FC<ItemRowProps> = ({ index, style, data }) => {
  const { items, viewMode, itemsPerRow, onStatusChange, onEdit, onDelete } = data;
  const startIndex = index * itemsPerRow;
  const endIndex = Math.min(startIndex + itemsPerRow, items.length);
  const rowItems = items.slice(startIndex, endIndex);

  return (
    <div style={style}>
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid gap-4' 
          : viewMode === 'list' 
            ? 'space-y-4' 
            : 'space-y-2'
        }
        ${viewMode === 'grid' ? `grid-cols-${itemsPerRow}` : ''}
      `}>
        {rowItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export const VirtualizedItemList: React.FC<VirtualizedItemListProps> = ({
  items,
  viewMode,
  onStatusChange,
  onEdit,
  onDelete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const itemsPerRow = getItemsPerRow(viewMode, containerWidth);
  const itemHeight = getItemHeight(viewMode);
  const totalRows = Math.ceil(items.length / itemsPerRow);

  const listData = useMemo(() => ({
    items,
    viewMode,
    itemsPerRow,
    onStatusChange,
    onEdit,
    onDelete
  }), [items, viewMode, itemsPerRow, onStatusChange, onEdit, onDelete]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="h-full">
      <List
        height={600} // Fixed height for virtualization
        itemCount={totalRows}
        itemSize={itemHeight}
        itemData={listData}
        overscanCount={2}
      >
        {ItemRow}
      </List>
    </div>
  );
};
