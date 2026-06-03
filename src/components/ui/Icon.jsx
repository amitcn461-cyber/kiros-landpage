import {
  Clock,
  UserMinus,
  Filter,
  ListX,
  Zap,
  FileText,
  Target,
  MessageCircle,
  Bot,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Stethoscope,
  Dumbbell,
  Briefcase,
  Megaphone,
  Wrench,
  Building2,
  ShieldCheck,
  CalendarCheck,
  Workflow,
  LayoutList,
} from 'lucide-react'

const map = {
  Clock,
  UserMinus,
  Filter,
  ListX,
  Zap,
  FileText,
  Target,
  MessageCircle,
  Bot,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Stethoscope,
  Dumbbell,
  Briefcase,
  Megaphone,
  Wrench,
  Building2,
  ShieldCheck,
  CalendarCheck,
  Workflow,
  LayoutList,
}

export default function Icon({ name, ...props }) {
  const Cmp = map[name]
  if (!Cmp) return null
  return <Cmp {...props} />
}
