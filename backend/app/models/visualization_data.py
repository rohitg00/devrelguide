from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import json

class MetricPoint(BaseModel):
    timestamp: datetime
    value: float
    category: str

class SkillUpdate(BaseModel):
    category: str
    name: str
    level: int
    timestamp: datetime

class CommunityNode(BaseModel):
    id: str
    name: str
    category: str
    connections: List[str]
    timestamp: datetime

class CareerPathNode(BaseModel):
    id: str
    role: str
    level: int
    skills: List[str]
    connections: List[str]
    timestamp: datetime

class VisualizationData:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.data = self._load_data()

    def _load_data(self) -> Dict:
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {'data': [], 'metadata': {'last_updated': None}}

    def _save_data(self):
        with open(self.file_path, 'w') as f:
            json.dump(self.data, f, indent=2, default=str)

    def append_metric(self, metric: MetricPoint):
        if 'data' not in self.data:
            self.data['data'] = []
        self.data['data'].append(metric.dict())
        self.data['metadata'] = {'last_updated': datetime.now().isoformat()}
        self._save_data()

    def append_skill(self, skill: SkillUpdate):
        if 'data' not in self.data:
            self.data['data'] = []
        existing = next((s for s in self.data['data']
                        if s['category'] == skill.category and s['name'] == skill.name), None)
        if existing:
            existing['level'] = skill.level
            existing['timestamp'] = skill.timestamp.isoformat()
        else:
            self.data['data'].append(skill.dict())
        self.data['metadata'] = {'last_updated': datetime.now().isoformat()}
        self._save_data()

    def append_community_node(self, node: CommunityNode):
        if 'nodes' not in self.data:
            self.data['nodes'] = []
        existing = next((n for n in self.data['nodes'] if n['id'] == node.id), None)
        if existing:
            existing.update(node.dict())
        else:
            self.data['nodes'].append(node.dict())
        self.data['metadata'] = {'last_updated': datetime.now().isoformat()}
        self._save_data()

    def append_career_path_node(self, node: CareerPathNode):
        if 'nodes' not in self.data:
            self.data['nodes'] = []
        existing = next((n for n in self.data['nodes'] if n['id'] == node.id), None)
        if existing:
            existing.update(node.dict())
        else:
            self.data['nodes'].append(node.dict())
        self.data['metadata'] = {'last_updated': datetime.now().isoformat()}
        self._save_data()

    def get_data(self) -> Dict:
        return self.data
