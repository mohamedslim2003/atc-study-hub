
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glass?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    fullWidth,
    glass,
    disabled,
    ...props 
  }, ref) => {
    let variantClass = variant;
    
    // Map custom variants to shadcn variants
    if (variant === 'primary') variantClass = 'default';
    if (variant === 'accent') variantClass = 'secondary';
    
    return (
      <ShadcnButton
        className={cn(
          // Button base styles
          'font-medium relative transition-all duration-200 transform active:scale-95',
          // Glass effect
          glass && 'backdrop-blur-md border border-white/20',
          // Full width option
          fullWidth && 'w-full',
          // Button size variants
          size === 'xl' && 'h-14 px-8 rounded-lg text-lg',
          // Custom styling based on variant
          variant === 'primary' && 'bg-primary hover:bg-primary/90 text-primary-foreground',
          variant === 'accent' && 'bg-accent hover:bg-accent/90 text-accent-foreground',
          className
        )}
        variant={variantClass as any}
        size={size === 'xl' ? 'lg' : size}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2 inline-flex">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex">{rightIcon}</span>
        )}
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
