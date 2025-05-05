
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllUsers, updateUserGrades, getUserById, debugLocalStorage } from '@/utils/userUtils';
import { toast } from 'sonner';
import { User, GraduationCap, Users, Search, ArrowUpDown, Mail, Edit } from 'lucide-react';
import { useTestGeneration } from '@/hooks/useTestGeneration';

// Extended user type with grades
type UserWithGrades = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  grades?: {
    [key: string]: number;
  };
};

const ManageStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<UserWithGrades[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<UserWithGrades | null>(null);
  const [editedGrades, setEditedGrades] = useState<{[key: string]: number}>({});
  const { assessLevel } = useTestGeneration();

  useEffect(() => {
    // Load all students
    debugLocalStorage(); // Add debug logging to check localStorage
    console.log('Loading students...');
    const allUsers = getAllUsers();
    console.log('Found users:', allUsers);
    setStudents(allUsers);
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const email = student.email.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'lastName') {
      comparison = a.lastName.localeCompare(b.lastName);
    } else if (sortBy === 'firstName') {
      comparison = a.firstName.localeCompare(b.firstName);
    } else if (sortBy === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortBy.startsWith('grade_')) {
      const testId = sortBy.replace('grade_', '');
      const gradeA = a.grades?.[testId] || 0;
      const gradeB = b.grades?.[testId] || 0;
      comparison = gradeA - gradeB;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleEditGrades = (student: UserWithGrades) => {
    setCurrentStudent(student);
    setEditedGrades(student.grades || {});
    setIsEditDialogOpen(true);
  };

  const handleGradeChange = (testId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
      setEditedGrades(prev => ({
        ...prev,
        [testId]: numValue
      }));
    }
  };

  const saveGrades = () => {
    if (currentStudent) {
      const success = updateUserGrades(currentStudent.id, editedGrades);
      
      if (success) {
        toast.success('Grades updated successfully');
        
        // Update student in the local state
        setStudents(prev => prev.map(student => 
          student.id === currentStudent.id 
            ? { ...student, grades: { ...student.grades, ...editedGrades } } 
            : student
        ));
        
        setIsEditDialogOpen(false);
      } else {
        toast.error('Failed to update grades');
      }
    }
  };

  // Helper to get the level badge color
  const getLevelBadgeColor = (score: number) => {
    const { level } = assessLevel(score);
    switch(level) {
      case 1: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case 2: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 3: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 4: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="animate-enter space-y-6">
      <header>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
            <p className="text-muted-foreground mt-1">
              View and manage student information and test grades
            </p>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>Total: {students.length} registered students</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Grading Scale</div>
                <div className="flex space-x-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    L1: ≤7
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    L2: 8-12
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    L3: 13-16
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    L4: 17-20
                  </span>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead 
                    onClick={() => handleSort('firstName')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center">
                      First Name 
                      {sortBy === 'firstName' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('lastName')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center">
                      Last Name 
                      {sortBy === 'lastName' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('email')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center">
                      Email 
                      {sortBy === 'email' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('grade_test1')}
                    className="cursor-pointer hover:bg-muted/50 text-right"
                  >
                    <div className="flex items-center justify-end">
                      Test 1 
                      {sortBy === 'grade_test1' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('grade_test2')}
                    className="cursor-pointer hover:bg-muted/50 text-right"
                  >
                    <div className="flex items-center justify-end">
                      Test 2 
                      {sortBy === 'grade_test2' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('grade_test3')}
                    className="cursor-pointer hover:bg-muted/50 text-right"
                  >
                    <div className="flex items-center justify-end">
                      Test 3 
                      {sortBy === 'grade_test3' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.length > 0 ? (
                  sortedStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{student.lastName}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {student.grades?.test1 !== undefined ? (
                          <div className="flex justify-end items-center">
                            <span className={`mr-1 px-2 py-0.5 rounded-full text-xs ${getLevelBadgeColor(student.grades.test1)}`}>
                              L{assessLevel(student.grades.test1).level}
                            </span>
                            <span>{student.grades.test1}/20</span>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {student.grades?.test2 !== undefined ? (
                          <div className="flex justify-end items-center">
                            <span className={`mr-1 px-2 py-0.5 rounded-full text-xs ${getLevelBadgeColor(student.grades.test2)}`}>
                              L{assessLevel(student.grades.test2).level}
                            </span>
                            <span>{student.grades.test2}/20</span>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {student.grades?.test3 !== undefined ? (
                          <div className="flex justify-end items-center">
                            <span className={`mr-1 px-2 py-0.5 rounded-full text-xs ${getLevelBadgeColor(student.grades.test3)}`}>
                              L{assessLevel(student.grades.test3).level}
                            </span>
                            <span>{student.grades.test3}/20</span>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          leftIcon={<Edit className="h-4 w-4" />}
                          onClick={() => handleEditGrades(student)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-12 w-12 mb-2 text-muted-foreground/60" />
                        <p className="text-base">No students found</p>
                        {searchTerm ? (
                          <p className="text-sm">Try adjusting your search criteria</p>
                        ) : (
                          <p className="text-sm">Register students to see them here</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Grades Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student Grades</DialogTitle>
            <DialogDescription>
              {currentStudent && `Adjust grades for ${currentStudent.firstName} ${currentStudent.lastName}`}
            </DialogDescription>
          </DialogHeader>
          
          {currentStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{currentStudent.firstName} {currentStudent.lastName}</p>
                  <p className="text-sm text-muted-foreground">{currentStudent.email}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="test1">Test 1 Score (0-20)</Label>
                  <Input
                    id="test1"
                    type="number"
                    min="0"
                    max="20"
                    value={editedGrades.test1 || 0}
                    onChange={(e) => handleGradeChange('test1', e.target.value)}
                  />
                  {editedGrades.test1 !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Level: {assessLevel(editedGrades.test1).level} - {assessLevel(editedGrades.test1).description}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test2">Test 2 Score (0-20)</Label>
                  <Input
                    id="test2"
                    type="number"
                    min="0"
                    max="20"
                    value={editedGrades.test2 || 0}
                    onChange={(e) => handleGradeChange('test2', e.target.value)}
                  />
                  {editedGrades.test2 !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Level: {assessLevel(editedGrades.test2).level} - {assessLevel(editedGrades.test2).description}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test3">Test 3 Score (0-20)</Label>
                  <Input
                    id="test3"
                    type="number"
                    min="0"
                    max="20"
                    value={editedGrades.test3 || 0}
                    onChange={(e) => handleGradeChange('test3', e.target.value)}
                  />
                  {editedGrades.test3 !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Level: {assessLevel(editedGrades.test3).level} - {assessLevel(editedGrades.test3).description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveGrades}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudentsPage;
