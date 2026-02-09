import {
  Calculator,
  BookOpen,
  FlaskConical,
  Globe,
  Heart,
  Music,
  Palette,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const subjects = [
  {
    id: 1,
    name: 'Toán',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    active: true,
  },
  {
    id: 2,
    name: 'Tiếng Việt',
    icon: BookOpen,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    active: true,
  },
  {
    id: 3,
    name: 'Khoa học',
    icon: FlaskConical,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    active: false,
  },
  {
    id: 4,
    name: 'Lịch sử & Địa lý',
    icon: Globe,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    active: false,
  },
  {
    id: 5,
    name: 'Đạo đức',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    active: false,
  },
  {
    id: 6,
    name: 'Âm nhạc',
    icon: Music,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    active: false,
  },
  {
    id: 7,
    name: 'Mỹ thuật',
    icon: Palette,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    active: false,
  },
  {
    id: 8,
    name: 'Thể dục',
    icon: Activity,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    active: false,
  },
];

export default function HomePage() {
  return (
    <div className="container py-12">
      {/* Welcome Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Chào mừng đến với Học cùng con!
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Nền tảng học tập trực tuyến cho học sinh lớp 4 theo chương trình Chân
          Trời Sáng Tạo. Học tập hiệu quả, vui vẻ và phát triển toàn diện.
        </p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <Card
              key={subject.id}
              className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div
                  className={`mb-3 flex h-16 w-16 items-center justify-center rounded-lg ${subject.bgColor}`}
                >
                  <Icon className={`h-8 w-8 ${subject.color}`} />
                </div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    subject.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {subject.active ? 'Đang hoạt động' : 'Sắp ra mắt'}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
