
import { Exercise, ExerciseSubmission } from '@/types/exercise';
import { supabase } from '@/integrations/supabase/client';

// Helper function to get exercises from Supabase database
const getStoredExercises = async (): Promise<Exercise[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('exercises')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching exercises from Supabase:", error);
      return [];
    }
    
    // Map database fields to Exercise interface
    return (data || []).map((exercise: any) => ({
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      questions: exercise.questions || [],
      createdAt: new Date(exercise.created_at),
      updatedAt: new Date(exercise.updated_at)
    }));
  } catch (error) {
    console.error("Error retrieving exercises:", error);
    return [];
  }
};

// Helper function to get exercise submissions from Supabase
const getStoredSubmissions = async (userId: string): Promise<ExerciseSubmission[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('exercise_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching exercise submissions:", error);
      return [];
    }
    
    return (data || []).map((submission: any) => ({
      id: submission.id,
      exerciseId: submission.exercise_id,
      userId: submission.user_id,
      answers: submission.answers || [],
      completedAt: new Date(submission.completed_at)
    }));
  } catch (error) {
    console.error("Error retrieving exercise submissions:", error);
    return [];
  }
};

export const getExercises = async (): Promise<Exercise[]> => {
  try {
    return await getStoredExercises();
  } catch (error) {
    console.error("Error getting exercises:", error);
    return [];
  }
};

export const getExerciseById = async (id: string): Promise<Exercise | undefined> => {
  try {
    if (!id) {
      console.error("Invalid exercise ID (empty)");
      return undefined;
    }
    
    const { data, error } = await (supabase as any)
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error getting exercise with ID ${id}:`, error);
      return undefined;
    }
    
    if (!data) {
      return undefined;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      questions: data.questions || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error(`Error getting exercise with ID ${id}:`, error);
    return undefined;
  }
};

export const createExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> => {
  const newId = crypto.randomUUID();
  
  const newExercise: Exercise = {
    ...exercise,
    id: newId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  try {
    const { data, error } = await (supabase as any)
      .from('exercises')
      .insert([{
        id: newExercise.id,
        title: newExercise.title,
        description: newExercise.description,
        category: newExercise.category,
        questions: newExercise.questions,
        created_at: newExercise.createdAt.toISOString(),
        updated_at: newExercise.updatedAt.toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Failed to create exercise:", error);
      throw new Error("Failed to save exercise to database");
    }
    
    return newExercise;
  } catch (error) {
    console.error("Failed to create exercise:", error);
    throw error;
  }
};

export const submitExercise = async (submission: Omit<ExerciseSubmission, 'id' | 'completedAt'>): Promise<ExerciseSubmission> => {
  try {
    const newSubmission: ExerciseSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      completedAt: new Date()
    };

    const { data, error } = await (supabase as any)
      .from('exercise_submissions')
      .upsert([{
        id: newSubmission.id,
        exercise_id: newSubmission.exerciseId,
        user_id: newSubmission.userId,
        answers: newSubmission.answers,
        completed_at: newSubmission.completedAt.toISOString()
      }], {
        onConflict: 'exercise_id,user_id'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Failed to submit exercise:", error);
      throw new Error("Failed to save exercise submission");
    }
    
    return newSubmission;
  } catch (error) {
    console.error("Failed to submit exercise:", error);
    throw error;
  }
};

export const getUserExerciseSubmissions = async (userId: string): Promise<ExerciseSubmission[]> => {
  try {
    return await getStoredSubmissions(userId);
  } catch (error) {
    console.error("Error getting user exercise submissions:", error);
    return [];
  }
};

export const getExerciseSubmission = async (exerciseId: string, userId: string): Promise<ExerciseSubmission | undefined> => {
  try {
    const { data, error } = await (supabase as any)
      .from('exercise_submissions')
      .select('*')
      .eq('exercise_id', exerciseId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Error getting exercise submission:", error);
      return undefined;
    }
    
    return {
      id: data.id,
      exerciseId: data.exercise_id,
      userId: data.user_id,
      answers: data.answers || [],
      completedAt: new Date(data.completed_at)
    };
  } catch (error) {
    console.error("Error getting exercise submission:", error);
    return undefined;
  }
};
