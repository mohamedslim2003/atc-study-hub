
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { FileText, Search, Filter, Trophy, Clock, BarChart, Calendar, Eye, Download, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { getTests, getUserTestSubmissions, createTest } from '@/services/testService';
import { Test, TestSubmission, Question, Option } from '@/types/test';
import TestView from '@/components/tests/TestView';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import CategoryWidget from '@/components/courses/CategoryWidget';

interface QuickTestFormData {
  title: string;
  description: string;
  duration: number;
  category: 'fundamentals' | 'advanced' | 'airspace' | 'emergency';
  question: string;
  options: string[];
  correctOptionIndex: number;
}

const TestsPage: React.FC = () => {
  const [showViewTestDialog, setShowViewTestDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'aerodrome' | 'approach' | 'ccr' | null>(null);
  const { isAdmin, user } = useAuth();

  const form = useForm<QuickTestFormData>({
    defaultValues: {
      title: '',
      description: '',
      duration: 15,
      category: 'fundamentals',
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    }
  });

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const allTests = getTests();
        setTests(allTests);
        
        if (user) {
          const userSubmissions = getUserTestSubmissions(user.id);
          setSubmissions(userSubmissions);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.error("Failed to load tests");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  useEffect(() => {
    // Check if we need to create tests for categories that don't have them
    if (!isAdmin && selectedCategory && tests.length > 0) {
      const categoryTests = tests.filter(test => test.category === selectedCategory);
      
      if (categoryTests.length === 0) {
        // Create a test for this category automatically
        generateTestForCategory(selectedCategory);
      } else {
        // Use the first test found for this category
        setSelectedTest(categoryTests[0]);
        setShowViewTestDialog(true);
      }
    }
  }, [selectedCategory, tests, isAdmin]);

  const generateTestForCategory = (category: 'aerodrome' | 'approach' | 'ccr') => {
    console.log(`Generating test for category: ${category}`);
    const questions = generateQuestionsForCategory(category);
    
    try {
      const newTest = createTest({
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Test`,
        description: `30-question test on ${category} topics with a 30-minute time limit.`,
        duration: 30, // 30 minutes
        category: category,
        questions: questions
      });
      
      // Add the new test to our state
      setTests(prevTests => [...prevTests, newTest]);
      
      // Select the test and show it
      setSelectedTest(newTest);
      setShowViewTestDialog(true);
      
      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} test created successfully!`);
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error(`Failed to create ${category} test`);
    }
  };
  
  const generateQuestionsForCategory = (category: 'aerodrome' | 'approach' | 'ccr'): Question[] => {
    const questions: Question[] = [];
    
    const questionsByCategory: Record<string, { question: string, options: string[], correctIndex: number }[]> = {
      'aerodrome': [
        {
          question: "What is the primary responsibility of an Aerodrome Control Tower?",
          options: [
            "To provide en-route traffic information",
            "To direct aircraft on runways and in the vicinity of the airport",
            "To manage airspace above FL245",
            "To coordinate oceanic crossings"
          ],
          correctIndex: 1
        },
        {
          question: "Which light signal from the control tower to an aircraft on the ground means 'Cleared for takeoff'?",
          options: [
            "Steady red",
            "Flashing red",
            "Steady green",
            "Flashing green"
          ],
          correctIndex: 2
        },
        {
          question: "What is the typical visibility requirement for VFR operations at an airport?",
          options: [
            "1 mile",
            "3 miles",
            "5 miles",
            "10 miles"
          ],
          correctIndex: 2
        },
        {
          question: "What does the acronym 'LDA' stand for in airport operations?",
          options: [
            "Long Distance Approach",
            "Landing Distance Available",
            "Lateral Displacement Area",
            "Last Departure Alert"
          ],
          correctIndex: 1
        },
        {
          question: "What is the standard taxi clearance delivery phrase?",
          options: [
            "Proceed to taxi",
            "Start taxiing now",
            "Taxi to holding point",
            "You are cleared to taxi"
          ],
          correctIndex: 2
        },
        {
          question: "What does a series of white dashes across a taxiway indicate?",
          options: [
            "Holding position for runway",
            "Intersection with another taxiway",
            "De-icing area ahead",
            "Closed taxiway section"
          ],
          correctIndex: 0
        },
        {
          question: "Which color are runway edge lights?",
          options: [
            "Blue",
            "Green",
            "Red",
            "White"
          ],
          correctIndex: 3
        },
        {
          question: "What is the maximum wind speed for safe airport operations?",
          options: [
            "Depends on aircraft type and runway orientation",
            "35 knots for all aircraft",
            "25 knots crosswind",
            "40 knots headwind"
          ],
          correctIndex: 0
        },
        {
          question: "What does a flashing white airport beacon indicate?",
          options: [
            "Military airport",
            "Civil airport",
            "Heliport",
            "Water airport"
          ],
          correctIndex: 1
        },
        {
          question: "Which frequency range is typically used for tower communications?",
          options: [
            "118.0-121.9 MHz",
            "121.5-121.9 MHz",
            "122.0-123.9 MHz",
            "126.7-129.9 MHz"
          ],
          correctIndex: 0
        },
        // additional 20 questions
        {
          question: "What is the purpose of runway guard lights?",
          options: [
            "To mark closed sections of runways",
            "To identify runway thresholds",
            "To warn pilots of an active runway ahead",
            "To indicate wind direction"
          ],
          correctIndex: 2
        },
        {
          question: "What are 'stop bars' in an airport environment?",
          options: [
            "Restaurants at the terminal",
            "Red lights across a taxiway that must not be crossed without clearance",
            "Physical barriers placed on closed runways",
            "Speed limiting devices for ground vehicles"
          ],
          correctIndex: 1
        },
        {
          question: "What is the primary purpose of runway markings?",
          options: [
            "To provide directional guidance to pilots",
            "To indicate the bearing of the runway",
            "To show the strength rating of the runway surface",
            "To identify and provide orientation information about the runway"
          ],
          correctIndex: 3
        },
        {
          question: "What color are taxiway edge lights?",
          options: [
            "White",
            "Red",
            "Blue",
            "Green"
          ],
          correctIndex: 2
        },
        {
          question: "What does a 'Land and Hold Short Operation' (LAHSO) require?",
          options: [
            "Aircraft must land and exit the runway as quickly as possible",
            "Aircraft must land and stop before reaching an intersecting runway or designated point",
            "Aircraft must land and maintain minimum taxi speed",
            "Aircraft must land and immediately begin takeoff preparations"
          ],
          correctIndex: 1
        },
        {
          question: "What is the purpose of a PAPI (Precision Approach Path Indicator) system?",
          options: [
            "To indicate taxi routes to pilots",
            "To provide visual glide slope information to pilots on approach",
            "To mark closed areas of the airport",
            "To signal emergency conditions to approaching aircraft"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'Low Visibility Procedures' (LVP) in airport operations?",
          options: [
            "Procedures implemented when visibility drops below specified minima",
            "Procedures for operating during nighttime",
            "Procedures for small aircraft operations",
            "Procedures for low altitude flying"
          ],
          correctIndex: 0
        },
        {
          question: "What does the term 'backtrack' refer to in aerodrome operations?",
          options: [
            "Returning an aircraft to the gate",
            "Taxiing in the opposite direction to landing",
            "Reversing an aircraft on a stand",
            "Taxiing on a runway in the opposite direction to takeoff and landing"
          ],
          correctIndex: 3
        },
        {
          question: "What is the function of runway threshold markings?",
          options: [
            "To indicate the beginning of the runway available for landing",
            "To mark areas where aircraft can turn around",
            "To indicate weight limitations",
            "To show taxi holding positions"
          ],
          correctIndex: 0
        },
        {
          question: "What does a single solid yellow line on a taxiway indicate?",
          options: [
            "Edge of taxiway",
            "Taxi centerline",
            "Holding position",
            "Closed taxiway"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'runway incursion'?",
          options: [
            "A scheduled runway inspection",
            "Any unauthorized entry onto a runway",
            "A temporary runway closure",
            "A planned maintenance operation"
          ],
          correctIndex: 1
        },
        {
          question: "What are 'hot spots' at an airport?",
          options: [
            "Areas with poor radio reception",
            "Locations with free Wi-Fi",
            "Areas with potential risk for surface incidents",
            "Designated smoking areas"
          ],
          correctIndex: 2
        },
        {
          question: "What does a red and white checkered pattern signal tower indicate?",
          options: [
            "Airport under construction",
            "Airport information service available",
            "Airport closed to all traffic",
            "Military operations in progress"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'displaced threshold'?",
          options: [
            "A runway threshold that has been relocated from its original position",
            "A threshold that only military aircraft can use",
            "A backup threshold used during emergencies",
            "A threshold designated for cargo operations only"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'apron management service'?",
          options: [
            "Cleaning service for the apron area",
            "Service providing regulation of activities on an apron",
            "Catering service for aircraft on the apron",
            "Maintenance service for apron equipment"
          ],
          correctIndex: 1
        },
        {
          question: "What are 'blast pads' on runways?",
          options: [
            "Areas designed to prevent erosion from jet blast",
            "Special surfaces for emergency braking",
            "Locations where aircraft can test engines",
            "Reinforced areas for helicopter operations"
          ],
          correctIndex: 0
        },
        {
          question: "What does a yellow cross on a runway indicate?",
          options: [
            "Intersection point with another runway",
            "Closed runway",
            "Displaced threshold",
            "Special operations area"
          ],
          correctIndex: 1
        },
        {
          question: "What is the primary purpose of an airport's 'movement area'?",
          options: [
            "Area for passenger movement",
            "Area used for aircraft ground movement",
            "Area for ground vehicle traffic only",
            "Area for loading cargo"
          ],
          correctIndex: 1
        },
        {
          question: "What is the purpose of a 'safety area' around a runway?",
          options: [
            "To provide a buffer zone in case an aircraft veers off the runway",
            "To keep wildlife away from the runway",
            "To store snow removal equipment",
            "To restrict unauthorized personnel"
          ],
          correctIndex: 0
        },
        {
          question: "What is the purpose of airport friction testing?",
          options: [
            "To test the durability of runway markings",
            "To assess braking performance on runway surfaces",
            "To evaluate lighting system effectiveness",
            "To check radio communication quality"
          ],
          correctIndex: 1
        },
      ],
      'approach': [
        {
          question: "What is the purpose of an Approach Control service?",
          options: [
            "To provide air traffic control service to arriving and departing flights",
            "To manage aircraft parking",
            "To coordinate flight plans for long-haul flights",
            "To supervise aircraft maintenance"
          ],
          correctIndex: 0
        },
        {
          question: "What does 'STAR' stand for in approach procedures?",
          options: [
            "Standard Terminal Arrival Route",
            "System for Terminal Air Routing",
            "Special Technical Approach Routing",
            "Simplified Terminal Approach Radar"
          ],
          correctIndex: 0
        },
        {
          question: "What is the typical vertical separation minimum in approach control airspace?",
          options: [
            "500 feet",
            "1000 feet",
            "2000 feet",
            "3000 feet"
          ],
          correctIndex: 1
        },
        {
          question: "What is a holding pattern?",
          options: [
            "A prearranged maneuver to keep aircraft within a specified airspace",
            "A specific runway usage pattern",
            "A traffic pattern for airport circuit training",
            "A fixed route for medevac helicopters"
          ],
          correctIndex: 0
        },
        {
          question: "What is an ILS Category III approach?",
          options: [
            "An approach using only radar guidance",
            "A precision approach with minimal or zero visibility requirements",
            "An approach for training purposes only",
            "A standard non-precision approach"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'vectoring' in approach control?",
          options: [
            "Providing headings to aircraft to guide them to a specific track",
            "Using mathematical calculations for approach speeds",
            "Configuring runway approach lighting",
            "Measuring wind speeds and directions"
          ],
          correctIndex: 0
        },
        {
          question: "What is the minimum radar separation in most terminal areas?",
          options: [
            "1 nautical mile",
            "3 nautical miles",
            "5 nautical miles",
            "10 nautical miles"
          ],
          correctIndex: 1
        },
        {
          question: "What does 'MDA' stand for in approach procedures?",
          options: [
            "Maximum Descent Altitude",
            "Minimum Descent Altitude",
            "Measured Descent Angle",
            "Mean Directional Alignment"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'go-around' procedure?",
          options: [
            "A procedure to bypass congested airspace",
            "A maneuver to abort a landing attempt",
            "An alternate routing to an airport",
            "A 360-degree turn for spacing"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'GBAS' in approach operations?",
          options: [
            "Ground Based Augmentation System",
            "General Broadcasting Alert System",
            "Global Basic Approach Service",
            "Guided Bearing Alignment System"
          ],
          correctIndex: 0
        },
        // additional 20 questions
        {
          question: "What is 'RNAV' in approach procedures?",
          options: [
            "Radar Navigation",
            "Area Navigation",
            "Runway Navigation",
            "Radio Navigation"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'stabilized approach'?",
          options: [
            "An approach where the airport has stable weather conditions",
            "An approach where the aircraft maintains constant speed, descent rate, and track",
            "An approach using ground stabilization equipment",
            "An approach with reduced fuel consumption"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'circling approach'?",
          options: [
            "An instrument approach followed by visual maneuvering to land on a runway not aligned with the final approach",
            "An approach that requires the aircraft to circle the airport before landing",
            "A holding pattern directly over the airport",
            "A visual approach with multiple turns"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'final approach fix' (FAF)?",
          options: [
            "The last waypoint before the missed approach point",
            "A repair to approach lighting systems",
            "The point where an aircraft begins its final descent",
            "A permanent approach path correction"
          ],
          correctIndex: 2
        },
        {
          question: "What is 'TCAS' and its role in approach control?",
          options: [
            "Traffic Control Alert System - manages approach sequencing",
            "Terminal Control Area System - designates special use airspace",
            "Traffic Alert and Collision Avoidance System - provides collision avoidance independent of ATC",
            "Takeoff and Climb Advisory Service - assists departing aircraft"
          ],
          correctIndex: 2
        },
        {
          question: "What is a 'visual approach'?",
          options: [
            "An approach conducted during daylight hours only",
            "An approach conducted by reference to terrain without instrument guidance",
            "An IFR approach procedure flown by visual reference to the ground",
            "An approach authorized only for aircraft with enhanced vision systems"
          ],
          correctIndex: 2
        },
        {
          question: "What does 'LAHSO' mean in approach operations?",
          options: [
            "Low Altitude High Speed Operations",
            "Land And Hold Short Operations",
            "Limited Approach Heading Standard Orientation",
            "Lateral Approach Height Safety Offset"
          ],
          correctIndex: 1
        },
        {
          question: "What is the difference between a precision and non-precision approach?",
          options: [
            "Precision approaches use radar, non-precision don't",
            "Precision approaches are only conducted in good weather",
            "Precision approaches provide vertical guidance, non-precision typically don't",
            "Precision approaches are only for large aircraft"
          ],
          correctIndex: 2
        },
        {
          question: "What are 'feeder fixes' in approach procedures?",
          options: [
            "Points where aircraft receive fuel before landing",
            "Navigation points that connect airways to approach procedures",
            "Locations where approach controllers take over from en-route controllers",
            "Predetermined points for emergency approach procedures"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'sidestep maneuver' in approach procedures?",
          options: [
            "A visual alignment with a parallel runway after completing an instrument approach",
            "An emergency procedure for engine failure",
            "A technique to avoid wake turbulence",
            "A special approach for crosswind conditions"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'DA/DH' in approach procedures?",
          options: [
            "Descent Angle/Descent Height",
            "Directional Alignment/Directional Heading",
            "Decision Altitude/Decision Height",
            "Departure Authorization/Departure Heading"
          ],
          correctIndex: 2
        },
        {
          question: "What is 'LNAV/VNAV' in approach procedures?",
          options: [
            "Lateral Navigation/Vertical Navigation",
            "Landing Navigate/Vector Navigation",
            "Limited Navigation/Variable Navigation",
            "Local Navigation/Visual Navigation"
          ],
          correctIndex: 0
        },
        {
          question: "What is the purpose of DME in approach procedures?",
          options: [
            "To measure drift in magnetic error",
            "To provide distance information to the aircraft",
            "To detect meteorological events",
            "To display moving elements on radar"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'contact approach'?",
          options: [
            "An approach requiring direct radio contact with the tower",
            "An approach requested by a pilot that allows descent in VMC below minimum altitudes",
            "An approach requiring radar contact throughout",
            "An approach where the pilot must establish visual contact with preceding aircraft"
          ],
          correctIndex: 1
        },
        {
          question: "What is meant by 'approach ban'?",
          options: [
            "Prohibition of a specific approach due to equipment failure",
            "Restriction preventing aircraft from continuing an approach when reported visibility is below specified minima",
            "Ban on approach procedures during military exercises",
            "Temporary closure of approach airspace during severe weather"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'straight-in approach'?",
          options: [
            "Any approach aligned directly with a runway",
            "An instrument approach where final approach course alignment with runway centerline is 30 degrees or less",
            "A visual approach with no turns required",
            "An approach with a straight descent profile only"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'RF leg' in approach procedures?",
          options: [
            "Required Frequency leg",
            "Radius to Fix leg",
            "Runway Facing leg",
            "Reduced Flap leg"
          ],
          correctIndex: 1
        },
        {
          question: "What is the purpose of a 'missed approach procedure'?",
          options: [
            "A procedure to follow when landing clearance is delayed",
            "A predefined maneuver performed when an approach cannot be continued to landing",
            "A procedure for aircraft that have missed their approach slot time",
            "An alternative routing when the primary approach aid is unserviceable"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'approach lighting system' (ALS)?",
          options: [
            "Aircraft landing lights used during approach",
            "A pattern of lights extending from the runway threshold providing visual guidance during approach",
            "Lighting within the approach control facility",
            "Emergency lighting activated during approach emergencies"
          ],
          correctIndex: 1
        },
        {
          question: "What does 'MDM' stand for in approach procedures?",
          options: [
            "Minimum Descent Margin",
            "Multiple Direction Monitoring",
            "Missed Distance Measurement",
            "Maximum Display Mode"
          ],
          correctIndex: 0
        },
      ],
      'ccr': [
        {
          question: "What is the primary responsibility of CCR (En-route Control Center)?",
          options: [
            "To provide ground movement control",
            "To control aircraft during cruise phase between terminal areas",
            "To manage gate assignments at airports",
            "To direct final approach to runways"
          ],
          correctIndex: 1
        },
        {
          question: "What does 'FIR' stand for in ATC?",
          options: [
            "Federal Information Regulation",
            "Flight Information Region",
            "Formal Instruction Record",
            "Final Instrument Reading"
          ],
          correctIndex: 1
        },
        {
          question: "What is the standard vertical separation at high altitudes (above FL290)?",
          options: [
            "500 feet",
            "1000 feet",
            "2000 feet",
            "4000 feet"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'RVSM' airspace?",
          options: [
            "Reduced Vertical Separation Minimum",
            "Regional Verification of Separation Measures",
            "Route Vectoring Safety Management",
            "Required Visual Separation Monitoring"
          ],
          correctIndex: 0
        },
        {
          question: "What is a 'Mach Number Technique'?",
          options: [
            "A method to calculate headwind component",
            "A separation technique based on maintaining specific Mach numbers",
            "A way to measure turbulence intensity",
            "A procedure for supersonic aircraft only"
          ],
          correctIndex: 1
        },
        {
          question: "What is a 'direct routing'?",
          options: [
            "A route with no radio communication required",
            "A route directly from departure to destination airport",
            "A route that bypasses standard airways",
            "A route with priority handling"
          ],
          correctIndex: 2
        },
        {
          question: "What is an 'oceanic clearance'?",
          options: [
            "Permission for an aircraft to enter oceanic airspace",
            "Approval for water landing capability",
            "Certification for transoceanic equipment",
            "Authorization for over-water emergency procedures"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'free route airspace'?",
          options: [
            "Airspace where no fees are charged",
            "Airspace with no traffic restrictions",
            "Airspace where aircraft can plan routes freely between defined entry and exit points",
            "Airspace reserved for military operations"
          ],
          correctIndex: 2
        },
        {
          question: "What does 'ETOPS' stand for?",
          options: [
            "Extended Twin-engine Operations",
            "En-route Traffic Organization Procedure System",
            "Emergency Takeoff Procedures System",
            "European Terminal Operations Program Standard"
          ],
          correctIndex: 0
        },
        {
          question: "What is a 'sector' in CCR operations?",
          options: [
            "A defined portion of airspace under control of a single controller position",
            "A type of radar display",
            "A segment of a standard arrival route",
            "A predefined emergency descent path"
          ],
          correctIndex: 0
        },
        // additional 20 questions
        {
          question: "What is the purpose of 'flow control' in CCR operations?",
          options: [
            "To regulate aircraft speed",
            "To manage the volume of traffic to ensure safe and efficient handling",
            "To direct the movement of ground vehicles",
            "To control airflow in the cockpit ventilation system"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'diverging traffic'?",
          options: [
            "Aircraft flying in opposite directions",
            "Aircraft encountering turbulence",
            "Aircraft flying away from each other",
            "Aircraft diverting from flight plan"
          ],
          correctIndex: 2
        },
        {
          question: "What is 'CPDLC' in CCR operations?",
          options: [
            "Controller Pilot Data Link Communications",
            "Central Processing Data Link Control",
            "Critical Path Distance Logging Computer",
            "Computerized Pilot Directional Link Calculator"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'time-based separation'?",
          options: [
            "Scheduling aircraft departures based on time slots",
            "Separation of aircraft based on time intervals rather than distance",
            "Allocating controller work shifts",
            "Determining when to hand off aircraft to next sector"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'ADS-B' technology?",
          options: [
            "Automatic Dependent Surveillance–Broadcast",
            "Air Data System Backup",
            "Advanced Display System for Broadcasting",
            "Airspace Division Standard-Basic"
          ],
          correctIndex: 0
        },
        {
          question: "What is a 'conflict alert' in CCR systems?",
          options: [
            "Warning about airspace violations",
            "Notification of predicted loss of separation between aircraft",
            "Alert about equipment failures",
            "Warning of adverse weather conditions"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'strategic deconfliction'?",
          options: [
            "Resolving traffic conflicts during flight planning stage",
            "Emergency procedure for avoiding mid-air collisions",
            "Post-flight analysis of close encounters",
            "Specialized radar filtering technique"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'airspace classification'?",
          options: [
            "Categorization of airspace based on dimensions",
            "Division of airspace based on weather conditions",
            "Categorization of airspace with different rules and requirements",
            "Ranking airspace by traffic density"
          ],
          correctIndex: 2
        },
        {
          question: "What is 'longitudinal separation'?",
          options: [
            "Separation between aircraft flying at the same altitude in the same direction",
            "Separation between parallel runways",
            "Separation between aircraft based on their longitude coordinates",
            "Separation of aircraft flying in east-west direction"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'level bust'?",
          options: [
            "Emergency descent procedure",
            "Unauthorized deviation from assigned flight level",
            "Setting incorrect altimeter pressure",
            "Climbing to avoid weather"
          ],
          correctIndex: 1
        },
        {
          question: "What is the purpose of a 'handoff' in CCR operations?",
          options: [
            "Transfer of control responsibility from one controller to another",
            "Shutdown procedure at end of shift",
            "Transfer of flight information to pilots",
            "Calculation of fuel requirements"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'MTCD' in CCR systems?",
          options: [
            "Medium Term Conflict Detection",
            "Multiple Trajectory Calculation Device",
            "Main Terminal Control Display",
            "Maximum Takeoff Climb Distance"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'procedural control' in ATC?",
          options: [
            "Control using documented procedures rather than radar",
            "Quality control of ATC procedures",
            "Control of procedure design for approaches",
            "Standardized emergency protocols"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'Mode S' transponder?",
          options: [
            "A special mode for supersonic aircraft",
            "A selective addressing secondary surveillance radar system",
            "A monitoring system for surface movement",
            "A military-only transponder setting"
          ],
          correctIndex: 1
        },
        {
          question: "What is an 'active flight plan'?",
          options: [
            "A flight plan that has been approved but not yet activated",
            "A flight plan that contains changes made after departure",
            "The current flight plan being followed by the aircraft",
            "A flight plan for aerobatic maneuvers"
          ],
          correctIndex: 2
        },
        {
          question: "What is 'ACAS' in aviation?",
          options: [
            "Airborne Collision Avoidance System",
            "Advanced Controller Alert System",
            "Automatic Control And Stabilization",
            "Air Carrier Authentication Service"
          ],
          correctIndex: 0
        },
        {
          question: "What is 'flexible use of airspace' concept?",
          options: [
            "Allowing pilots to choose any flight path",
            "Airspace that can be used for different purposes at different times",
            "Procedure allowing altitude changes without clearance",
            "Using airspace for both civil and aerobatic flying"
          ],
          correctIndex: 1
        },
        {
          question: "What is 'trajectory-based operations'?",
          options: [
            "Managing air traffic by predicting and optimizing flight trajectories",
            "Operations based only on aircraft performance",
            "Specialized techniques for helicopter operations",
            "Military precision bombing operations"
          ],
          correctIndex: 0
        },
        {
          question: "What is a 'cleared flight level'?",
          options: [
            "Any altitude free of traffic",
            "A level at which an aircraft is authorized to fly",
            "A flight level without weather restrictions",
            "Maximum altitude for a specific aircraft type"
          ],
          correctIndex: 1
        },
        {
          question: "What does 'FDPS' stand for in CCR?",
          options: [
            "Flight Data Processing System",
            "Full Display Plot Screen",
            "Federal Department of Pilot Safety",
            "Flight Direction Programming Software"
          ],
          correctIndex: 0
        },
      ]
    };
    
    // Select 30 questions for this category
    const categoryQuestions = questionsByCategory[category] || [];
    if (categoryQuestions.length === 0) {
      console.error(`No questions available for category: ${category}`);
      return questions;
    }
    
    for (let i = 0; i < 30 && i < categoryQuestions.length; i++) {
      const q = categoryQuestions[i];
      
      // Create question object
      const options: Option[] = q.options.map((text, index) => ({
        id: `q${i+1}o${index+1}`,
        text
      }));
      
      const question: Question = {
        id: `q${i+1}`,
        text: q.question,
        options,
        correctOptionId: `q${i+1}o${q.correctIndex+1}`
      };
      
      questions.push(question);
    }
    
    return questions;
  };

  const handleQuickCreate = (data: QuickTestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create a question from the form data
      const options: Option[] = data.options.map((text, index) => ({
        id: `q1o${index + 1}`,
        text
      }));

      const question: Question = {
        id: 'q1',
        text: data.question,
        options,
        correctOptionId: `q1o${data.correctOptionIndex + 1}`
      };

      // Create the test with our single question
      const newTest = createTest({
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        questions: [question]
      });
      
      // Refresh the tests list
      setTests([...tests, newTest]);
      toast.success("Test created successfully!");
      setShowQuickCreate(false);
      form.reset();
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle test view
  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
    setShowViewTestDialog(true);
  };
  
  const handleCreateTestClick = () => {
    setShowQuickCreate(!showQuickCreate);
  };

  const handleCategorySelect = (category: 'aerodrome' | 'approach' | 'ccr') => {
    setSelectedCategory(category);
  };

  // Function to filter tests by search query
  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const completedTests = submissions.length;
  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length)
    : 0;
  const nextScheduledTest = tests.length > 0 ? "Today" : "No tests available";

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
            <p className="text-muted-foreground mt-1">
              Assess your knowledge with mock exams
            </p>
          </div>
          {isAdmin && (
            <div className="ml-auto">
              <Button 
                onClick={handleCreateTestClick}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Test
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Stats cards */}
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

      {/* Category selector - Only show for regular users */}
      {!isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Select Test Category</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <CategoryWidget 
              category="aerodrome" 
              isActive={selectedCategory === 'aerodrome'} 
              onClick={() => handleCategorySelect('aerodrome')} 
            />
            <CategoryWidget 
              category="approach" 
              isActive={selectedCategory === 'approach'} 
              onClick={() => handleCategorySelect('approach')} 
            />
            <CategoryWidget 
              category="ccr" 
              isActive={selectedCategory === 'ccr'} 
              onClick={() => handleCategorySelect('ccr')} 
            />
          </div>
        </div>
      )}

      {/* Search and filters - Only show for admin */}
      {isAdmin && (
        <div className="mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search tests..." 
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="md:w-auto" leftIcon={<Filter className="h-4 w-4" />}>
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Create Form - Only shown when Create Test is clicked for admin */}
      {showQuickCreate && isAdmin && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Create Test</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowQuickCreate(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleQuickCreate)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter test title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter test description" 
                          className="min-h-16"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col md:flex-row gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="fundamentals" id="fundamentals" />
                            </FormControl>
                            <FormLabel htmlFor="fundamentals" className="font-normal cursor-pointer">
                              Fundamentals
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="advanced" id="advanced" />
                            </FormControl>
                            <FormLabel htmlFor="advanced" className="font-normal cursor-pointer">
                              Advanced
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="airspace" id="airspace" />
                            </FormControl>
                            <FormLabel htmlFor="airspace" className="font-normal cursor-pointer">
                              Airspace
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="emergency" id="emergency" />
                            </FormControl>
                            <FormLabel htmlFor="emergency" className="font-normal cursor-pointer">
                              Emergency
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="text-lg font-medium">Question</h3>
                  
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your question here..." 
                            className="min-h-16"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Options</h4>
                    
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Checkbox 
                          id={`option-${index}`} 
                          checked={form.watch('correctOptionIndex') === index}
                          onCheckedChange={() => form.setValue('correctOptionIndex', index)}
                        />
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={form.watch('options')[index]}
                          onChange={(e) => {
                            const newOptions = [...form.watch('options')];
                            newOptions[index] = e.target.value;
                            form.setValue('options', newOptions);
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Create Test
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Available Tests Section - Only show for admin */}
      {isAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Tests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span>Loading tests...</span>
                </div>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="p-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-10 w-10 text-muted-foreground/70" />
                  <h3 className="font-medium">No tests available</h3>
                  <p className="text-sm text-muted-foreground">
                    {isAdmin ? 
                      "Create a new test to get started." : 
                      "Check back later for available tests."}
                  </p>
                  {isAdmin && (
                    <Button 
                      onClick={() => setShowQuickCreate(true)}
                      className="mt-2"
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Create Test
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredTests.map((test) => {
                  const userSubmission = submissions.find(s => s.testId === test.id);
                  const hasCompleted = !!userSubmission;
                  
                  return (
                    <div key={test.id} className="p-6 hover:bg-muted/40 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{test.title}</h3>
                              {hasCompleted && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  Completed ({Math.round(userSubmission.score)}%)
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 mb-2">
                              {test.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                <Clock className="h-3 w-3 mr-1" /> {test.duration} minutes
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                <FileText className="h-3 w-3 mr-1" /> {test.questions.length} questions
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                <BarChart className="h-3 w-3 mr-1" /> {test.category}
                              </span>
                              {test.courseName && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                  Course: {test.courseName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          leftIcon={<Eye className="h-4 w-4" />}
                          onClick={() => handleViewTest(test)}
                          className="md:w-auto"
                        >
                          {hasCompleted ? "Review Test" : "Start Test"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Take Test Dialog */}
      <Dialog 
        open={showViewTestDialog} 
        onOpenChange={(open) => {
          if (!open) setSelectedTest(null);
          setShowViewTestDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>
            {selectedTest?.title || "Test"}
          </DialogTitle>
          {selectedTest && (
            <TestView 
              test={selectedTest} 
              onComplete={() => {
                // Refresh submissions after test completion
                if (user) {
                  const userSubmissions = getUserTestSubmissions(user.id);
                  setSubmissions(userSubmissions);
                }
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestsPage;
