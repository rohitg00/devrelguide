'use client';

import React from 'react';
import {
  ResponsiveContainer,
  Treemap,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import { VisualizationContainer } from './VisualizationContainer';

interface SkillPoint {
  name: string;
  value: number;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'expert';
}

const skillData: SkillPoint[] = [
  { name: 'Technical Writing', value: 75, category: 'content', proficiency: 'expert' },
  { name: 'API Documentation', value: 85, category: 'content', proficiency: 'expert' },
  { name: 'Community Building', value: 70, category: 'community', proficiency: 'intermediate' },
  { name: 'Public Speaking', value: 65, category: 'advocacy', proficiency: 'intermediate' },
  { name: 'Code Reviews', value: 80, category: 'technical', proficiency: 'expert' },
  { name: 'Workshop Design', value: 60, category: 'education', proficiency: 'intermediate' },
  { name: 'Social Media', value: 55, category: 'marketing', proficiency: 'beginner' },
  { name: 'Video Production', value: 45, category: 'content', proficiency: 'beginner' },
  { name: 'Data Analysis', value: 70, category: 'technical', proficiency: 'intermediate' },
  { name: 'Event Planning', value: 65, category: 'community', proficiency: 'intermediate' }
];

const COLORS = {
  expert: '#4CAF50',
  intermediate: '#FFC107',
  beginner: '#FF5722'
};

const transformDataForTreeMap = () => {
  const categories = Array.from(new Set(skillData.map(d => d.category)));
  return {
    name: 'Skills',
    children: categories.map(category => ({
      name: category,
      children: skillData
        .filter(skill => skill.category === category)
        .map(skill => ({
          name: skill.name,
          size: skill.value,
          proficiency: skill.proficiency
        }))
    }))
  };
};

const transformDataForRadar = () => {
  const proficiencies = ['beginner', 'intermediate', 'expert'] as const;
  const categories = Array.from(new Set(skillData.map(d => d.category)));

  return categories.map(category => {
    const skills = skillData.filter(d => d.category === category);
    const result: { [key: string]: any } = { category };

    proficiencies.forEach(prof => {
      const profSkills = skills.filter(s => s.proficiency === prof);
      result[prof] = profSkills.length > 0
        ? profSkills.reduce((acc, curr) => acc + curr.value, 0) / profSkills.length
        : 0;
    });

    return result;
  });
};

export function SkillDistribution() {
  const treeMapData = transformDataForTreeMap();
  const radarData = transformDataForRadar();

  return (
    <VisualizationContainer
      title="Skill Distribution Analysis"
      description="Comprehensive view of DevRel skill distribution across different categories and proficiency levels."
    >
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TreeMap */}
        <div className="w-full h-full">
          <ResponsiveContainer>
            <Treemap
              data={treeMapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="visualization-tooltip">
                        <p className="text-xs sm:text-sm font-semibold line-clamp-1">{data.name}</p>
                        {data.size && (
                          <>
                            <p className="text-xs line-clamp-1">Value: {data.size}</p>
                            <p className="text-xs line-clamp-1">Proficiency: {data.proficiency}</p>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="w-full h-full">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Expert"
                dataKey="expert"
                stroke={COLORS.expert}
                fill={COLORS.expert}
                fillOpacity={0.6}
              />
              <Radar
                name="Intermediate"
                dataKey="intermediate"
                stroke={COLORS.intermediate}
                fill={COLORS.intermediate}
                fillOpacity={0.6}
              />
              <Radar
                name="Beginner"
                dataKey="beginner"
                stroke={COLORS.beginner}
                fill={COLORS.beginner}
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </VisualizationContainer>
  );
}
