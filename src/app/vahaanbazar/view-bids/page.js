"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const ViewBidsPage = dynamic(() => import('./viewBids'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <ViewBidsPage />
  );
}