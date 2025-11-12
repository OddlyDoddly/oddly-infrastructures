import { Container } from '@/shared/ui/layout';
import { Button } from '@/shared/ui/buttons';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/feedback';
import { Spinner } from '@/shared/ui/feedback';
import { ExampleItemList } from '../ui/ExampleItemList';
import { useGetExampleItemsQuery } from '../api/example.api';
import { useAppDispatch } from '@/app/hooks';
import { selectItem } from '../model/example.slice';

/**
 * Example Page
 * 
 * Main page for the example feature.
 * Orchestrates data fetching, state management, and UI composition.
 * 
 * This demonstrates the complete FOFA pattern:
 * - Data fetching via RTK Query (which uses WebClient)
 * - State management via Redux slice
 * - UI composition with presentational components
 */
export default function ExamplePage() {
  const dispatch = useAppDispatch();
  const { data: items, isLoading, error, refetch } = useGetExampleItemsQuery();

  const handleSelectItem = (id: string) => {
    dispatch(selectItem(id));
    // In a real app, this might navigate to a detail page
    console.log('Selected item:', id);
  };

  return (
    <Container maxWidth="xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Example Items</h1>
            <p className="mt-2 text-muted-foreground">
              This is an example page demonstrating the FOFA React infrastructure
            </p>
          </div>
          <Button onClick={() => refetch()} intent="outline">
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" label="Loading items..." />
          </div>
        ) : error ? (
          <Alert intent="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load example items. Please try again later.
            </AlertDescription>
          </Alert>
        ) : items ? (
          <ExampleItemList items={items} onSelectItem={handleSelectItem} />
        ) : null}
      </div>
    </Container>
  );
}
