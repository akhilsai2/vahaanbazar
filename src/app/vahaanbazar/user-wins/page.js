"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const UserWinsPage = dynamic(() => import('./user-wins'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <UserWinsPage />
  );
}