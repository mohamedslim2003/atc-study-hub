
import React from 'react';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { Compass, Airplane, Map } from 'lucide-react';

interface CategoryWidgetProps {
  category: 'aerodrome' | 'approach' | 'ccr';
  isActive: boolean;
  onClick: () => void;
}

const CategoryWidget: React.FC<CategoryWidgetProps> = ({ 
  category, 
  isActive, 
  onClick 
}) => {
  // Configure widget based on category
  const getWidgetConfig = () => {
    switch (category) {
      case 'aerodrome':
        return {
          title: 'Aerodrome',
          icon: <Airplane className="h-8 w-8" />,
          description: 'Air traffic control for airport surface movements',
          color: 'from-blue-500/20 to-blue-600/20',
          activeColor: 'from-blue-500/40 to-blue-600/40',
        };
      case 'approach':
        return {
          title: 'Approach',
          icon: <Compass className="h-8 w-8" />,
          description: 'Control for arriving and departing traffic',
          color: 'from-green-500/20 to-green-600/20',
          activeColor: 'from-green-500/40 to-green-600/40',
        };
      case 'ccr':
        return {
          title: 'CCR',
          icon: <Map className="h-8 w-8" />,
          description: 'En-route air traffic control',
          color: 'from-purple-500/20 to-purple-600/20',
          activeColor: 'from-purple-500/40 to-purple-600/40',
        };
    }
  };

  const config = getWidgetConfig();
  
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div className={`h-24 bg-gradient-to-br ${isActive ? config.activeColor : config.color} flex items-center justify-center`}>
        {config.icon}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{config.title}</h3>
        <p className="text-sm text-muted-foreground">
          {config.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CategoryWidget;
