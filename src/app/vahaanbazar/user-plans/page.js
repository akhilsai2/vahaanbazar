"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const UserPlansPage = dynamic(() => import('./userPlans'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <UserPlansPage />
  );
}