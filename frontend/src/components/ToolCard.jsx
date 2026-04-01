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
      className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-gray-200 hover:border-brand-orange bg-white group"
      onClick={() => navigate(tool.route)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="p-4 rounded-xl mb-3 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${tool.color}15` }}
          >
            <IconComponent className="h-9 w-9 transition-colors" style={{ color: tool.color }} />
          </div>
          {tool.isNew && (
            <Badge className="bg-brand-orange text-white hover:bg-brand-orange-dark font-semibold shadow-md">
              New!
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-bold text-brand-navy group-hover:text-brand-orange transition-colors">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed text-gray-600">
          {tool.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
