'use client';

import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface CareerNode {
  name: string;
  size: number;
  category: string;
  skills: string[];
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
}

const data: CareerNode[] = [
  {
    name: 'Technical Writing',
    size: 100,
    category: 'Content',
    skills: ['Documentation', 'API Reference', 'Tutorials'],
    level: 'Entry'
  },
  {
    name: 'Community Management',
    size: 120,
    category: 'Engagement',
    skills: ['Forum Moderation', 'Event Planning', 'User Support'],
    level: 'Entry'
  },
  {
    name: 'Developer Education',
    size: 150,
    category: 'Education',
    skills: ['Workshop Creation', 'Video Content', 'Code Examples'],
    level: 'Mid'
  },
  {
    name: 'Technical Advocacy',
    size: 180,
    category: 'Technical',
    skills: ['Public Speaking', 'Demo Development', 'Technical Blog Posts'],
    level: 'Mid'
  },
  {
    name: 'Strategy & Analytics',
    size: 200,
    category: 'Leadership',
    skills: ['Metrics Analysis', 'Program Planning', 'Stakeholder Management'],
    level: 'Senior'
  },
  {
    name: 'DevRel Leadership',
    size: 250,
    category: 'Leadership',
    skills: ['Team Management', 'Budget Planning', 'Program Direction'],
    level: 'Lead'
  }
];

const COLORS = {
  Content: '#8884d8',
  Engagement: '#82ca9d',
  Education: '#ffc658',
  Technical: '#ff7c43',
  Leadership: '#8dd1e1'
};

export function CareerPathway() {
  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">DevRel Career Progression</h3>
      <div className="w-full aspect-[4/3] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CareerNode;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-semibold">{data.name}</p>
                      <p>Level: {data.level}</p>
                      <p>Category: {data.category}</p>
                      <p className="font-medium mt-2">Key Skills:</p>
                      <ul className="list-disc list-inside">
                        {data.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CareerPathway;
