import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { BookOpen, Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import CourseCard from '@/components/courses/CourseCard';
import { getCourses, deleteCourse } from '@/services/courseService';
import { Course } from '@/types/course';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CategoryWidget from '@/components/courses/CategoryWidget';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [activeCategory, setActiveCategory] = useState<'aerodrome' | 'approach' | 'ccr' | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    loadCourses();
  }, []);
  
  const loadCourses = () => {
    const allCourses = getCourses();
    setCourses(allCourses);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
  };
  
  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      loadCourses();
      toast.success(`${courseToDelete.title} has been deleted`);
      setCourseToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setCourseToDelete(null);
  };
  
  const handleCategoryClick = (category: 'aerodrome' | 'approach' | 'ccr') => {
    setActiveCategory(activeCategory === category ? null : category);
  };
  
  // Filter courses by search and category
  const filteredCourses = courses.filter(course => {
    // Text search
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = activeCategory ? course.category === activeCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
              <p className="text-muted-foreground mt-1">
                Browse available courses to enhance your ATC knowledge
              </p>
            </div>
          </div>
          {isAdmin && (
            <Button 
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => navigate('/dashboard/courses/create')}
            >
              Add Course
            </Button>
          )}
        </div>
      </header>

      {/* Category Widgets */}
      <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-3">
        <CategoryWidget 
          category="aerodrome" 
          isActive={activeCategory === 'aerodrome'} 
          onClick={() => handleCategoryClick('aerodrome')} 
        />
        <CategoryWidget 
          category="approach" 
          isActive={activeCategory === 'approach'} 
          onClick={() => handleCategoryClick('approach')} 
        />
        <CategoryWidget 
          category="ccr" 
          isActive={activeCategory === 'ccr'} 
          onClick={() => handleCategoryClick('ccr')} 
        />
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" className="md:w-auto" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active category display */}
      {activeCategory && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold capitalize">
            {activeCategory} Courses
            <Button 
              variant="link" 
              onClick={() => setActiveCategory(null)} 
              className="ml-2 h-auto p-0"
            >
              (Show All)
            </Button>
          </h2>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isAdmin={isAdmin}
              onEdit={() => navigate(`/dashboard/courses/edit/${course.id}`)}
              onDelete={() => handleDeleteClick(course)}
            />
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {searchQuery || activeCategory 
                ? 'No Results Found' 
                : 'No Courses Available Yet'}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-10">
            <div className="text-center">
              <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || activeCategory 
                  ? 'No matching courses' 
                  : 'No Courses Available Yet'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchQuery || activeCategory
                  ? 'Try adjusting your search criteria or category selection' 
                  : isAdmin
                    ? 'Add your first course to get started'
                    : 'Courses will be added by the administrator soon. Check back later for updated content.'
                }
              </p>
              <div className="flex flex-col items-center gap-2">
                {isAdmin ? (
                  <Button onClick={() => navigate('/dashboard/courses/create')}>
                    Add First Course
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setActiveCategory(null);
                  }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample courses section (show only if no real courses and not searching) */}
      {courses.length === 0 && !searchQuery && !activeCategory && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <div className="h-40 bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/60" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">ATC Fundamentals</h3>
                <p className="text-sm text-muted-foreground">
                  Learn the fundamental concepts and procedures of air traffic control.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/60" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Airspace Classifications</h3>
                <p className="text-sm text-muted-foreground">
                  Understand different airspace classes and their regulations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/60" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Communication Protocols</h3>
                <p className="text-sm text-muted-foreground">
                  Master standard ATC communication protocols and phraseology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;
