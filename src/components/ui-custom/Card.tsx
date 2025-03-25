
import React from 'react';
import { cn } from '@/lib/utils';
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Define props for our enhanced Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  bordered?: boolean;
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

// Enhanced Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, glass, bordered = true, shadowSize = 'sm', padding = 'md', children, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          // Base styling
          'transition-all duration-300',
          // Hover effect
          hover && 'hover:-translate-y-1 hover:shadow-md',
          // Glass morphism effect
          glass && 'backdrop-blur-lg bg-white/80 border-white/20',
          // Border options
          !bordered && 'border-0',
          // Shadow options
          shadowSize === 'none' && 'shadow-none',
          shadowSize === 'sm' && 'shadow-sm',
          shadowSize === 'md' && 'shadow-md',
          shadowSize === 'lg' && 'shadow-lg',
          // Padding options are applied to the CardContent
          className
        )}
        {...props}
      >
        {children}
      </ShadcnCard>
    );
  }
);
Card.displayName = 'Card';

// Define props for enhanced CardContent
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

// Enhanced CardContent
const EnhancedCardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    return (
      <CardContent
        ref={ref}
        className={cn(
          // Padding options
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-3',
          padding === 'md' && 'p-5',
          padding === 'lg' && 'p-6',
          padding === 'xl' && 'p-8',
          className
        )}
        {...props}
      >
        {children}
      </CardContent>
    );
  }
);
EnhancedCardContent.displayName = 'EnhancedCardContent';

// Export our enhanced components and original shadcn components
export { 
  Card, 
  EnhancedCardContent as CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription
};
