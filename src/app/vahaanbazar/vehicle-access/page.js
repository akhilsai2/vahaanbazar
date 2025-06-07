"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const VehicleAccessPage = dynamic(() => import('./vehicleAccess'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <VehicleAccessPage />
  );
}