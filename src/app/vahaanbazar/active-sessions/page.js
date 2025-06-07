"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const ActiveSessionPage = dynamic(() => import('./activeSessions'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <ActiveSessionPage />
  );
}