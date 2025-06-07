"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const UserListPage = dynamic(() => import('./userlist'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <UserListPage />
  );
}