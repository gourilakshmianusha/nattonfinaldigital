import React from 'react';
import AdminApplication from '../admin/AdminApplication';
import { RoutePath } from '../types';
interface AdminProps { setPath: (path: RoutePath) => void; darkMode: boolean; setSelectedBlogPostId?: (id: string | null) => void; }
export default function Admin(_props: AdminProps) { return <AdminApplication />; }
