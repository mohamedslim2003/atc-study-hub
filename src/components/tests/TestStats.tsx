
import React from 'react';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { FileText, Trophy, Calendar } from 'lucide-react';

interface TestStatsProps {
  completedTests: number;
  averageScore: number;
  nextScheduledTest: string;
}

const TestStats: React.FC<TestStatsProps> = ({
  completedTests,
  averageScore,
  nextScheduledTest
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
              <h3 className="text-2xl font-bold mt-1">{completedTests}</h3>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <h3 className="text-2xl font-bold mt-1">{averageScore}%</h3>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Scheduled Test</p>
              <h3 className="text-2xl font-bold mt-1">{nextScheduledTest}</h3>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestStats;
