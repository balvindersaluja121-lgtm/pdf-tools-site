import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  FileText,
  Split,
  Minimize2,
  FileType,
  Presentation,
  Sheet as SheetIcon,
  Image,
  Edit,
  FileSignature,
  Droplet,
  RotateCw,
  Code,
  Lock,
  Unlock,
  FolderOpen,
  Archive,
  Wrench,
  Hash,
  Scan,
  Eye,
  EyeOff,
  Crop,
  Sparkles,
  Languages
} from 'lucide-react';

const iconMap = {
  merge: FileText,
  split: Split,
  compress: Minimize2,
  word: FileType,
  powerpoint: Presentation,
  excel: SheetIcon,
  image: Image,
  edit: Edit,
  sign: FileSignature,
  watermark: Droplet,
  rotate: RotateCw,
  html: Code,
  unlock: Unlock,
  lock: Lock,
  organize: FolderOpen,
  pdfa: Archive,
  repair: Wrench,
  numbers: Hash,
  scan: Scan,
  ocr: Eye,
  redact: EyeOff,
  crop: Crop,
  ai: Sparkles,
  translate: Languages
};

const ToolCard = ({ tool }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[tool.icon] || FileText;

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200"
      onClick={() => navigate(tool.route)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="p-3 rounded-lg mb-3"
            style={{ backgroundColor: `${tool.color}15` }}
          >
            <IconComponent className="h-8 w-8" style={{ color: tool.color }} />
          </div>
          {tool.isNew && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              New!
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
