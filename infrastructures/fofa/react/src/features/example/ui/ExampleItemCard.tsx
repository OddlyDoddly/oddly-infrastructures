import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/cards';
import { Button } from '@/shared/ui/buttons';
import type { ExampleItem } from '../model/example.types';

interface ExampleItemCardProps {
  item: ExampleItem;
  onSelect?: (id: string) => void;
}

/**
 * Example Item Card
 * 
 * Presentational component for displaying an example item.
 * Accepts props and has no side effects - pure UI component.
 */
export function ExampleItemCard({ item, onSelect }: ExampleItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          Status: <span className="capitalize">{item.status}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        {item.metadata && (
          <div className="mt-4 flex gap-4 text-sm">
            <span>👁️ {item.metadata.views} views</span>
            <span>❤️ {item.metadata.likes} likes</span>
          </div>
        )}
      </CardContent>
      {onSelect && (
        <CardFooter>
          <Button onClick={() => onSelect(item.id)} intent="outline" size="sm">
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
