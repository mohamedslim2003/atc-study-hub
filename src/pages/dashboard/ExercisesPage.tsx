
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { ClipboardList, Clock, BarChart } from 'lucide-react';
import { useExerciseManagement } from '@/hooks/useExerciseManagement';
import ExerciseCategoryFilters from '@/components/exercises/ExerciseCategoryFilters';
import ExerciseViewDialog from '@/components/exercises/ExerciseViewDialog';

const ExercisesPage: React.FC = () => {
  const {
    selectedExercise,
    showViewExerciseDialog,
    selectedCategory,
    isLoading,
    completedExercises,
    inProgressExercises,
    handleCategorySelect,
    handleExerciseComplete,
    setShowViewExerciseDialog,
    setSelectedExercise
  } = useExerciseManagement();

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
            <p className="text-muted-foreground mt-1">
              Practice your skills with interactive exercises
            </p>
          </div>
        </div>
      </header>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold mt-1">{completedExercises}</h3>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <h3 className="text-2xl font-bold mt-1">{inProgressExercises}</h3>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Practice Mode</p>
                <h3 className="text-2xl font-bold mt-1">Active</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <ExerciseCategoryFilters
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Information Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Practice Questions</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Each exercise contains 10 multiple-choice questions from the selected category.
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>No time limit</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground ml-4">
                      <BarChart className="h-3.5 w-3.5 mr-1" />
                      <span>Practice mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No Grading System</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Focus on learning without pressure. Your answers are saved but not graded.
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Learn at your pace</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground ml-4">
                      <BarChart className="h-3.5 w-3.5 mr-1" />
                      <span>Repeat anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exercise View Dialog */}
      <ExerciseViewDialog
        showDialog={showViewExerciseDialog}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExercise(null);
          }
          setShowViewExerciseDialog(open);
        }}
        selectedExercise={selectedExercise}
        onComplete={handleExerciseComplete}
      />
    </div>
  );
};

export default ExercisesPage;
