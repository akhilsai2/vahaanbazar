"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const ViewVehiclesInterest = dynamic(() => import('./vehicleInterest'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <ViewVehiclesInterest />
  );
}