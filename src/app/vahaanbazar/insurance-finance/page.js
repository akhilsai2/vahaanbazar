"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const InsuranceFinance = dynamic(() => import('./insurance-finance'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <InsuranceFinance />
  );
}