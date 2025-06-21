"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const VehicleUploadPage = dynamic(() => import('./vehicleUpload'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <VehicleUploadPage />
  );
}