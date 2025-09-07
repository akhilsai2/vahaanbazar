"use client"
import dynamic from 'next/dynamic';
import Loader from '../../../components/loaders';

const ViewVehicles = dynamic(() => import('./vehicles'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <ViewVehicles />
  );
}