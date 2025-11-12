import { ExampleItemCard } from './ExampleItemCard';
import type { ExampleItem } from '../model/example.types';

interface ExampleItemListProps {
  items: ExampleItem[];
  onSelectItem?: (id: string) => void;
}

/**
 * Example Item List
 * 
 * Presentational component for displaying a list of example items.
 * Pure UI component with no side effects.
 */
export function ExampleItemList({ items, onSelectItem }: ExampleItemListProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ExampleItemCard key={item.id} item={item} onSelect={onSelectItem} />
      ))}
    </div>
  );
}
