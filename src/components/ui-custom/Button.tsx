import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Define button variants using cva
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Add primary as a valid variant (same as default)
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define the props for our custom Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
  to?: string; // Add support for the 'to' prop used by react-router Link
}

// Create the Button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    leftIcon, 
    rightIcon, 
    isLoading = false, 
    asChild = false,
    as,
    to,
    children, 
    ...props 
  }, ref) => {
    // Special case for react-router Link
    if (as === Link && to) {
      return (
        <Link
          to={to}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Link>
      );
    }
    
    // If as prop is provided, use that element type
    if (as) {
      const Component = as;
      return (
        <Component
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Component>
      );
    }

    // If asChild is true, forward all props to the child element
    if (asChild) {
      return (
        <Slot 
          className={cn(buttonVariants({ variant, size, className }))} 
          ref={ref}
          {...props}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Slot>
      );
    }

    // Otherwise, return a regular button with the specified props
    return (
      <ShadcnButton
        className={className}
        variant={variant}
        size={size}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
