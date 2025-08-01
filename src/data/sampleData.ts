import {
  Employee,
  ManpowerProject,
  AttendanceRecord,
  ActionableInsight,
  EmployeeDocument
} from '../types/manpower';

// Generate comprehensive sample data for demonstration
export const generateSampleData = () => {
  const employees: Employee[] = [
    {
      id: 'emp_001',
      name: 'Ahmed Al-Rashid',
      employeeId: 'EMP001',
      trade: 'Site Supervisor',
      nationality: 'Saudi',
      phoneNumber: '+966501234567',
      hourlyRate: 35.00,
      actualRate: 55.00,
      projectId: 'proj_001',
      status: 'active',
      skills: ['Leadership', 'Safety Management', 'Quality Control', 'Project Coordination'],
      certifications: ['OSHA Certified', 'Project Management Professional', 'Safety Officer License'],
      performanceRating: 92,
      emergencyContact: '+966501234568',
      documents: [
        {
          id: 'doc_001',
          employeeId: 'emp_001',
          name: 'Saudi National ID',
          type: 'iqama',
          fileName: 'saudi_id_001.pdf',
          fileSize: 2048,
          uploadDate: new Date('2024-01-15'),
          expiryDate: '2025-01-15',
          isExpired: false,
          daysUntilExpiry: 365,
          notes: 'Valid Saudi national ID'
        },
        {
          id: 'doc_002',
          employeeId: 'emp_001',
          name: 'Safety Certificate',
          type: 'certificate',
          fileName: 'safety_cert_001.pdf',
          fileSize: 1024,
          uploadDate: new Date('2024-02-01'),
          expiryDate: '2025-02-01',
          isExpired: false,
          daysUntilExpiry: 400,
          notes: 'OSHA safety certification'
        }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_002',
      name: 'Mohammad Hassan',
      employeeId: 'EMP002',
      trade: 'Heavy Equipment Operator',
      nationality: 'Pakistani',
      phoneNumber: '+966502345678',
      hourlyRate: 28.00,
      actualRate: 45.00,
      projectId: 'proj_001',
      status: 'active',
      skills: ['Heavy Machinery Operation', 'Excavator Operation', 'Crane Operation', 'Equipment Maintenance'],
      certifications: ['Heavy Equipment License', 'Safety Training Certificate', 'Crane Operator License'],
      performanceRating: 88,
      emergencyContact: '+966502345679',
      documents: [
        {
          id: 'doc_003',
          employeeId: 'emp_002',
          name: 'Work Visa',
          type: 'visa',
          fileName: 'work_visa_002.pdf',
          fileSize: 1536,
          uploadDate: new Date('2024-02-01'),
          expiryDate: '2025-02-01',
          isExpired: false,
          daysUntilExpiry: 400,
          notes: 'Valid work visa for Saudi Arabia'
        },
        {
          id: 'doc_004',
          employeeId: 'emp_002',
          name: 'Equipment License',
          type: 'certificate',
          fileName: 'equipment_license_002.pdf',
          fileSize: 512,
          uploadDate: new Date('2024-03-01'),
          expiryDate: '2025-03-01',
          isExpired: false,
          daysUntilExpiry: 430,
          notes: 'Heavy equipment operation license'
        }
      ],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_003',
      name: 'Ali Al-Mahmoud',
      employeeId: 'EMP003',
      trade: 'Electrician',
      nationality: 'Egyptian',
      phoneNumber: '+966503456789',
      hourlyRate: 32.00,
      actualRate: 50.00,
      projectId: 'proj_002',
      status: 'active',
      skills: ['Electrical Installation', 'Maintenance & Repair', 'Troubleshooting', 'Control Systems'],
      certifications: ['Electrical License', 'Safety Certification', 'Control Systems Certificate'],
      performanceRating: 90,
      emergencyContact: '+966503456790',
      documents: [
        {
          id: 'doc_005',
          employeeId: 'emp_003',
          name: 'Iqama',
          type: 'iqama',
          fileName: 'iqama_003.pdf',
          fileSize: 1024,
          uploadDate: new Date('2024-03-01'),
          expiryDate: '2024-12-30',
          isExpired: false,
          daysUntilExpiry: 15,
          notes: 'Iqama renewal required soon'
        }
      ],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_004',
      name: 'Fatima Al-Zahra',
      employeeId: 'EMP004',
      trade: 'Safety Officer',
      nationality: 'Saudi',
      phoneNumber: '+966504567890',
      hourlyRate: 40.00,
      actualRate: 65.00,
      projectId: 'proj_003',
      status: 'active',
      skills: ['Safety Inspection', 'Risk Assessment', 'Training & Development', 'Incident Investigation'],
      certifications: ['Safety Officer License', 'First Aid Certificate', 'Risk Assessment Certification'],
      performanceRating: 95,
      emergencyContact: '+966504567891',
      documents: [
        {
          id: 'doc_006',
          employeeId: 'emp_004',
          name: 'Safety Officer License',
          type: 'certificate',
          fileName: 'safety_license_004.pdf',
          fileSize: 512,
          uploadDate: new Date('2024-04-01'),
          expiryDate: '2025-04-01',
          isExpired: false,
          daysUntilExpiry: 120,
          notes: 'Professional safety officer certification'
        }
      ],
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_005',
      name: 'Omar Al-Kindi',
      employeeId: 'EMP005',
      trade: 'Welder',
      nationality: 'Yemeni',
      phoneNumber: '+966505678901',
      hourlyRate: 30.00,
      actualRate: 48.00,
      status: 'active',
      skills: ['Arc Welding', 'TIG Welding', 'MIG Welding', 'Metal Fabrication'],
      certifications: ['Welding Certification', 'Safety Training Certificate', 'Metal Fabrication License'],
      performanceRating: 87,
      emergencyContact: '+966505678902',
      documents: [
        {
          id: 'doc_007',
          employeeId: 'emp_005',
          name: 'Passport',
          type: 'passport',
          fileName: 'passport_005.pdf',
          fileSize: 2048,
          uploadDate: new Date('2024-05-01'),
          expiryDate: '2026-05-01',
          isExpired: false,
          daysUntilExpiry: 500,
          notes: 'Valid Yemeni passport'
        }
      ],
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_006',
      name: 'Hassan Al-Mutairi',
      employeeId: 'EMP006',
      trade: 'Mechanic',
      nationality: 'Saudi',
      phoneNumber: '+966506789012',
      hourlyRate: 33.00,
      actualRate: 52.00,
      projectId: 'proj_001',
      status: 'active',
      skills: ['Vehicle Maintenance', 'Engine Repair', 'Hydraulic Systems', 'Preventive Maintenance'],
      certifications: ['Automotive Technician License', 'Hydraulic Systems Certificate'],
      performanceRating: 89,
      emergencyContact: '+966506789013',
      documents: [],
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_007',
      name: 'Rajesh Kumar',
      employeeId: 'EMP007',
      trade: 'Carpenter',
      nationality: 'Indian',
      phoneNumber: '+966507890123',
      hourlyRate: 26.00,
      actualRate: 42.00,
      projectId: 'proj_002',
      status: 'active',
      skills: ['Wood Working', 'Furniture Making', 'Construction Carpentry', 'Tool Maintenance'],
      certifications: ['Carpentry Certificate', 'Safety Training'],
      performanceRating: 85,
      emergencyContact: '+966507890124',
      documents: [],
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'emp_008',
      name: 'Abdul Rahman',
      employeeId: 'EMP008',
      trade: 'Plumber',
      nationality: 'Bangladeshi',
      phoneNumber: '+966508901234',
      hourlyRate: 24.00,
      actualRate: 38.00,
      status: 'active',
      skills: ['Pipe Installation', 'Leak Repair', 'Drainage Systems', 'Water Systems'],
      certifications: ['Plumbing License', 'Safety Certificate'],
      performanceRating: 83,
      emergencyContact: '+966508901235',
      documents: [],
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-12-15')
    }
  ];

  const projects: ManpowerProject[] = [
    {
      id: 'proj_001',
      name: 'Aramco Facility Maintenance',
      client: 'Saudi Aramco',
      contractor: 'HRMS',
      location: 'Dhahran Industrial Complex',
      startDate: '2024-01-15',
      endDate: '2025-01-14',
      budget: 1200000,
      status: 'active' as const,
      progress: 75,
      description: 'Comprehensive maintenance services for Aramco facilities including equipment servicing, safety inspections, and preventive maintenance programs. This project involves maintaining critical infrastructure and ensuring operational continuity.',
      requirements: ['Certified technicians', 'Safety equipment', 'Specialized tools', 'Emergency response team'],
      deliverables: ['Monthly maintenance reports', 'Equipment certifications', 'Safety compliance documentation', 'Performance analytics'],
      riskLevel: 'medium',
      profitMargin: 25.5,
      statusHistory: [
        {
          id: 'status_001',
          projectId: 'proj_001',
          status: 'active',
          progress: 75,
          notes: 'Project progressing well, ahead of schedule. Team performance excellent.',
          updatedBy: 'Ahmed Al-Rashid',
          updatedAt: new Date('2024-12-15'),
          followUp: {
            id: 'followup_001',
            statusEntryId: 'status_001',
            isRequired: true,
            followUpDate: '2024-12-20',
            followUpTime: '10:00',
            reminderPreference: 'email',
            actionDescription: 'Review quarterly performance metrics and plan next phase',
            priority: 'medium',
            isCompleted: false,
            escalationLevel: 0
          }
        }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'proj_002',
      name: 'SABIC Construction Support',
      client: 'SABIC Industries',
      contractor: 'HRMS',
      location: 'Jubail Industrial City',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      budget: 850000,
      status: 'hold' as const,
      progress: 60,
      description: 'Construction support services for SABIC industrial expansion including structural work, electrical installations, and safety compliance. Focus on quality delivery and timeline adherence.',
      requirements: ['Construction crew', 'Electrical specialists', 'Safety officers', 'Quality control team'],
      deliverables: ['Construction milestones', 'Safety reports', 'Quality assurance documentation', 'Progress updates'],
      riskLevel: 'high',
      profitMargin: 22.8,
      statusHistory: [
        {
          id: 'status_002',
          projectId: 'proj_002',
          status: 'active',
          progress: 60,
          notes: 'On track with construction timeline. Weather delays minimal.',
          updatedBy: 'Mohammad Hassan',
          updatedAt: new Date('2024-12-10')
        }
      ],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-12-10')
    },
    {
      id: 'proj_003',
      name: 'NEOM Infrastructure Development',
      client: 'NEOM Development',
      contractor: 'HRMS',
      location: 'NEOM - Tabuk Province',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      budget: 2100000,
      status: 'finished' as const,
      progress: 35,
      description: 'Infrastructure development support for NEOM mega-project including road construction, utility installations, and environmental compliance. This is a flagship project requiring highest standards.',
      requirements: ['Large workforce', 'Heavy machinery', 'Environmental specialists', 'Advanced equipment'],
      deliverables: ['Infrastructure milestones', 'Environmental reports', 'Progress documentation', 'Compliance certificates'],
      riskLevel: 'high',
      profitMargin: 28.2,
      statusHistory: [
        {
          id: 'status_003',
          projectId: 'proj_003',
          status: 'active',
          progress: 35,
          notes: 'Challenging terrain but making steady progress. Additional resources may be needed.',
          updatedBy: 'Ali Al-Mahmoud',
          updatedAt: new Date('2024-12-12'),
          followUp: {
            id: 'followup_002',
            statusEntryId: 'status_003',
            isRequired: true,
            followUpDate: '2024-12-18',
            followUpTime: '14:00',
            reminderPreference: 'both',
            actionDescription: 'Assess resource requirements and timeline adjustments',
            priority: 'high',
            isCompleted: false,
            escalationLevel: 1
          }
        }
      ],
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-12-12')
    }
  ];

  const attendance: AttendanceRecord[] = [
    // Recent attendance records for demonstration
    {
      id: 'att_001',
      employeeId: 'emp_001',
      projectId: 'proj_001',
      date: '2024-12-15',
      hoursWorked: 8,
      overtime: 2,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Dhahran Site A - Maintenance Bay',
      weatherConditions: 'Clear',
      approvedBy: 'Site Manager',
      notes: 'Supervised maintenance team, completed equipment inspection',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'att_002',
      employeeId: 'emp_002',
      projectId: 'proj_001',
      date: '2024-12-15',
      hoursWorked: 8,
      overtime: 1.5,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Dhahran Site A - Equipment Yard',
      weatherConditions: 'Clear',
      approvedBy: 'Site Manager',
      notes: 'Equipment operation and routine maintenance completed',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'att_003',
      employeeId: 'emp_003',
      projectId: 'proj_002',
      date: '2024-12-15',
      hoursWorked: 8,
      overtime: 0,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Jubail Site B - Electrical Section',
      weatherConditions: 'Partly Cloudy',
      approvedBy: 'Project Supervisor',
      notes: 'Electrical installations completed as scheduled',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'att_004',
      employeeId: 'emp_004',
      projectId: 'proj_003',
      date: '2024-12-15',
      hoursWorked: 8,
      overtime: 1,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'NEOM Site C - Safety Office',
      weatherConditions: 'Windy',
      approvedBy: 'Safety Manager',
      notes: 'Safety inspection completed, training session conducted',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'att_005',
      employeeId: 'emp_006',
      projectId: 'proj_001',
      date: '2024-12-15',
      hoursWorked: 8,
      overtime: 0.5,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Dhahran Site A - Workshop',
      weatherConditions: 'Clear',
      notes: 'Vehicle maintenance and repairs completed',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 'att_006',
      employeeId: 'emp_007',
      projectId: 'proj_002',
      date: '2024-12-15',
      hoursWorked: 8,
      overtime: 0,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Jubail Site B - Construction Area',
      weatherConditions: 'Partly Cloudy',
      notes: 'Carpentry work on schedule, quality standards met',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    // Previous week's data
    {
      id: 'att_007',
      employeeId: 'emp_001',
      projectId: 'proj_001',
      date: '2024-12-14',
      hoursWorked: 8,
      overtime: 1,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Dhahran Site A',
      notes: 'Team coordination and planning session',
      createdAt: new Date('2024-12-14'),
      updatedAt: new Date('2024-12-14')
    },
    {
      id: 'att_008',
      employeeId: 'emp_002',
      projectId: 'proj_001',
      date: '2024-12-14',
      hoursWorked: 8,
      overtime: 2,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: 'Dhahran Site A',
      notes: 'Extended equipment operation due to urgent maintenance',
      createdAt: new Date('2024-12-14'),
      updatedAt: new Date('2024-12-14')
    }
  ];

  const insights: ActionableInsight[] = [
    {
      id: 'insight_001',
      type: 'optimization',
      title: 'Optimize Resource Allocation for NEOM Project',
      description: 'Project NEOM has 35% progress but highest profit margin potential (28.2%). Consider allocating more skilled workers to accelerate completion and maximize revenue.',
      impact: 'high',
      category: 'operational',
      actionRequired: true,
      estimatedBenefit: 150000,
      implementationCost: 25000,
      priority: 1,
      status: 'new'
    },
    {
      id: 'insight_002',
      type: 'alert',
      title: 'Critical Document Expiry Alert',
      description: 'Ali Al-Mahmoud\'s Iqama expires in 15 days (December 30, 2024). Immediate renewal required to avoid work disruption and legal compliance issues.',
      impact: 'high',
      category: 'operational',
      actionRequired: true,
      deadline: '2024-12-30',
      priority: 2,
      status: 'new'
    },
    {
      id: 'insight_003',
      type: 'achievement',
      title: 'Excellent Safety Performance Record',
      description: 'Zero safety incidents reported across all projects this month. Safety protocols and training programs are working effectively. Fatima Al-Zahra\'s safety leadership is exemplary.',
      impact: 'medium',
      category: 'safety',
      actionRequired: false,
      priority: 3,
      status: 'new'
    },
    {
      id: 'insight_004',
      type: 'recommendation',
      title: 'Profit Margin Enhancement Opportunity',
      description: 'Heavy Equipment Operators show 17 SAR profit per hour. Consider increasing actual rates for this trade by 10-15% to improve overall profitability.',
      impact: 'high',
      category: 'financial',
      actionRequired: false,
      estimatedBenefit: 75000,
      implementationCost: 5000,
      priority: 4,
      status: 'new'
    },
    {
      id: 'insight_005',
      type: 'optimization',
      title: 'Unassigned Workforce Optimization',
      description: 'Omar Al-Kindi and Abdul Rahman are currently unassigned. Their skills could be valuable for the SABIC project to accelerate completion.',
      impact: 'medium',
      category: 'operational',
      actionRequired: true,
      estimatedBenefit: 30000,
      implementationCost: 2000,
      priority: 5,
      status: 'new'
    }
  ];

  return {
    employees,
    projects,
    attendance,
    insights
  };
};

// Utility function to generate realistic attendance data
export const generateAttendanceData = (
  employees: Employee[],
  projects: ManpowerProject[],
  days: number = 30
): AttendanceRecord[] => {
  const attendance: AttendanceRecord[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];

    // Skip weekends (Friday and Saturday in Saudi Arabia)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) continue;

    employees.forEach(employee => {
      if (employee.projectId && employee.status === 'active') {
        // 90% attendance rate simulation
        if (Math.random() > 0.1) {
          const baseHours = 8;
          const overtimeChance = Math.random();
          const overtime = overtimeChance > 0.7 ? Math.random() * 3 : 0; // 30% chance of overtime

          attendance.push({
            id: `att_${employee.id}_${dateString}`,
            employeeId: employee.id,
            projectId: employee.projectId,
            date: dateString,
            hoursWorked: baseHours,
            overtime: Number(overtime.toFixed(1)),
            breakTime: 1,
            lateArrival: Math.random() > 0.9 ? Math.random() * 0.5 : 0, // 10% chance of being late
            earlyDeparture: 0,
            location: `${projects.find(p => p.id === employee.projectId)?.location || 'Unknown'} - Work Area`,
            weatherConditions: ['Clear', 'Partly Cloudy', 'Cloudy', 'Windy'][Math.floor(Math.random() * 4)],
            notes: `Regular work day - ${employee.trade} duties completed`,
            createdAt: new Date(dateString),
            updatedAt: new Date(dateString)
          });
        }
      }
    });
  }

  return attendance;
};