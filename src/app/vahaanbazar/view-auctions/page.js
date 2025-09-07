"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const ViewAuctions = dynamic(() => import('./viewAuctions'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <ViewAuctions />
  );
}