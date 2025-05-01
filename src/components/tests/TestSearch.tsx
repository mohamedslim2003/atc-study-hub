
import React from 'react';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-custom/Button';
import { Search, Filter } from 'lucide-react';

interface TestSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TestSearch: React.FC<TestSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tests..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto" leftIcon={<Filter className="h-4 w-4" />}>
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSearch;
