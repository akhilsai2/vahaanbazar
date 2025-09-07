"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const ViewBidsPage = dynamic(() => import('./approve-bids'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <ViewBidsPage />
  );
}