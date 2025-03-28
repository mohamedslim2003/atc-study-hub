
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui-custom/Button';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Course } from '@/types/course';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEdit, 
  onDelete,
  isAdmin = false 
}) => {
  const navigate = useNavigate();
  const createdDate = new Date(course.createdAt);

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-40 bg-primary/20 flex items-center justify-center relative">
        {course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="h-12 w-12 text-primary/60" />
        )}
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg">{course.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Added {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex-grow">
        <p className="line-clamp-3">{course.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end pt-2 pb-4">
        {isAdmin && (
          <>
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </>
        )}
        <Button 
          size="sm"
          onClick={() => navigate(`/dashboard/courses/${course.id}`)}
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
