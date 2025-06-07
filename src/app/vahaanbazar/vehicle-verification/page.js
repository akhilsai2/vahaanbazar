"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const VehicleVerificationPage = dynamic(() => import('./vehicleVerification'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <VehicleVerificationPage />
  );
}